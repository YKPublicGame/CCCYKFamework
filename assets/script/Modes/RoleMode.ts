import { IMode } from "../../YK/core/ModeMgr/ModeMgr";
import { loginReq, UserData, loginResp } from "../Defs/CodingTips";
import { NetMgr, HttpRespData } from "../../YK/core/Net/NetMgr";
import { ProtocolDef } from "../Defs/ProtocolDef";
import { ResponseMessageEvent } from "../../YK/core/Net/ResponseMessageEvent";
import { Func } from "../../YK/core/EventMgr/DispatchEventNode";

export class RoleMode extends IMode
{
    public accountInfo = { userid: 0, token: "" }
    public roleInfo: UserData
    public OnInitData(param: any): void
    {
        this.eventMgr.setNetCallback(this.OnNetEvenet, 99)
        this.eventMgr.addNetEvent(200);
    }
    public OnClear(): void
    {
    }

    public OnDestroy(): void
    {
        super.OnDestroy()
    }

    public OnNetEvenet(ev: ResponseMessageEvent)
    {
        if (ev.Data.head.errorcode == 0)
        {
            if (ev.Data.head.cmd == 200)
            {
                this.OnLoginResp(ev.Data.msg)
            }
        }

    }

    public SendHttpLogin(account: string, pwd: string, callBack: Func)
    {
        NetMgr.Instance.SendGet("modeName=account&api=login&account=" + account + "&pwd=" + pwd, new Func(this, (res: HttpRespData) =>
        {
            if (res != null && res.errorcode == 0)
            {
                this.accountInfo.token = res.data.token
                this.accountInfo.userid = res.data.userid
            }
            if (callBack != null)
            {
                callBack.Invoke(res)
            }
        }));
    }

    /**
     * 发送登陆
     * @param userid 用户id
     * @param token 账号token
     */
    public SendLogin(): void
    {
        let sendData: loginReq = { token: this.accountInfo.token, roleid: this.accountInfo.userid }
        NetMgr.Instance.Send(200, sendData)
    }

    /**
     * 登陆返回
     * @param loginResp 登陆的返回信息
     */
    public OnLoginResp(loginResp: loginResp)
    {
        this.roleInfo = loginResp.roleinfo
    }



}