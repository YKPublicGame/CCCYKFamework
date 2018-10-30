import { BaseUI, UIMgr } from "../../YK/core/UIMgr/UIMgr";
import { TimeDelay } from "../../YK/core/Util/TimeDelay";
import { LoadingWind } from "./LoadingWind";
import { SceneMgr } from "../../YK/core/SceneMgr/SceneMgr";
import MainScene from "../Scene/MainScene";
import { NetMgr, HttpRespData, NetMgrEventDef } from "../../YK/core/Net/NetMgr";
import { Func, EventData } from "../../YK/core/EventMgr/DispatchEventNode";
import { ParamConfigList, ParamConfig, loginReq } from "../Defs/CodingTips";
import { ResponseMessageEvent, ResponseDataInfo } from "../../YK/core/Net/ResponseMessageEvent";
import { MessageBox } from "./MessageBox";
import { ModeMgr } from "../../YK/core/ModeMgr/ModeMgr";
import { RoleMode } from "../Modes/RoleMode";

export class LoginWind extends BaseUI
{

    public modal: boolean = false
    public dontDel: boolean = false
    public prefabUrl = "prefab/LoginScene/LoginWind"
    protected clickBbackgroundClose = false
    protected EditBoxUser: cc.EditBox = null
    protected EditBoxPwd: cc.EditBox = null

    protected OnInit(param: any)
    {
        super.OnInit(param)
        this.eventMgr.setNetCallback(this.OnNetMsg)
        this.EditBoxUser = this.UIObj.get("EditBoxUser").getComponent(cc.EditBox)
        this.EditBoxPwd = this.UIObj.get("EditBoxPwd").getComponent(cc.EditBox)
        this.EditBoxPwd.string = "123456"
    }

    protected OnBtnClick(ev: cc.Event.EventCustom)
    {
        super.OnBtnClick(ev)

        if (ev.target.name = "BtnEnter")
        {
            //NetMgr.Instance.connect()
            this.HttpLogin();
        }
    }

    public HttpLogin()
    {
        if (this.EditBoxUser.string == "" || this.EditBoxPwd.string == "")
        {
            MessageBox.Create("请输入账号密码").Show()
        }
        else
        {
            UIMgr.Instance.ShowModalWait()
            ModeMgr.Instance.GetMode<RoleMode>(RoleMode).SendHttpLogin(this.EditBoxUser.string, this.EditBoxPwd.string, new Func(this, (res: HttpRespData) =>
            {

                if (res != null)
                {
                    if (res.errorcode == 0)
                    {
                        this.ConnectServer()
                    }
                    else
                    {
                        UIMgr.Instance.CloseModalWait()
                        MessageBox.Create(res.msg).Show()
                    }
                }
                else
                {
                    UIMgr.Instance.CloseModalWait()
                    MessageBox.Create("登陆失败尝试重新登陆").Show()
                }
            }))
        }
    }

    public ConnectServer()
    {
        NetMgr.Instance.connect()
    }
    public OnConnetServer()
    {
        ModeMgr.Instance.GetMode<RoleMode>(RoleMode).SendLogin() 
    }

    public OnLogin(ev: ResponseDataInfo)
    {
        UIMgr.Instance.CloseModalWait()
        if (ev.head.errorcode == 0)
        {
            UIMgr.Instance.ShowModalWait()
            ModeMgr.Instance.SendInitMsg()
        }
        else
        {
            MessageBox.Create(ev.msg).Show()
        }
    }

    public OnInitMsged()
    {
        //UIMgr.Instance.CloseModalWait()
        
        SceneMgr.Instance.GoToScene(MainScene)
    }

    public OnConnetServerError(error: string)
    {
        MessageBox.Create("链接服务器失败，尝试重连")
            .SetBtnConfirmCallBack(new Func(this, () =>
            {
                this.ConnectServer()
            }), "重试")
            .Show()
    }

    public OnShown(param: any)
    {
        super.OnShown(param)
        UIMgr.Instance.HideWind(LoadingWind)
        this.eventMgr.addNetEvent(200);
        this.eventMgr.addNetEvent(NetMgrEventDef.onopen)
        this.eventMgr.addNetEvent(NetMgrEventDef.onerror)
        this.eventMgr.addModeEvent(ModeMgr.EventType.SENDINITMSGOK)
    }

    public OnHide()
    {
        super.OnHide()
    }

    public onDestroy()
    {

    }

    protected OnHandler(ev: EventData)
    {
        if (ev.cmd == ModeMgr.EventType.SENDINITMSGOK)
        {
            this.OnInitMsged()
        }
    }

    protected OnNetMsg(ev: ResponseMessageEvent)
    {
        if (ev.cmd == NetMgrEventDef.onopen)
        {
            this.OnConnetServer()
        }
        else if (ev.cmd == NetMgrEventDef.onerror || ev.cmd == NetMgrEventDef.onclose)
        {
            this.OnConnetServerError(ev.data)
        }
        else
        {
            if (ev.Data.head.cmd == 200)
            {
                this.OnLogin(ev.Data)
            }
            else if (ev.Data.head.cmd >= 400)
            {
                console.log(ev.Data.head.cmd+"返回") 
                console.log(ev)
            }
        }

    }

}