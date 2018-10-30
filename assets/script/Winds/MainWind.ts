import { BaseUI, UIMgr } from "../../YK/core/UIMgr/UIMgr";
import { TimeDelay } from "../../YK/core/Util/TimeDelay";
import { LoadingWind } from "./LoadingWind";
import { ParamConfigList, roomIdData } from "../Defs/CodingTips";
import { NetMgr } from "../../YK/core/Net/NetMgr";
import { ResponseMessageEvent } from "../../YK/core/Net/ResponseMessageEvent";
import { ModeMgr } from "../../YK/core/ModeMgr/ModeMgr";
import { PrivRoomMode } from "../Modes/PrivRoomMode";
import { CreateWind } from "./CreateWind";

export class MainWind extends BaseUI

{
    public modal: boolean = false
    public dontDel: boolean = false
    protected contentPane: cc.Node = null
    public prefabUrl = "prefab/MainScne/FrontCover"
    protected clickBbackgroundClose = false
    protected TestBox: cc.EditBox = null

    protected OnInit(param: any)
    {

        super.OnInit(param)

        this.TestBox = this.UIObj.get("TestBox").getComponent(cc.EditBox)
    }

    protected OnBtnClick(ev: cc.Event.EventCustom)
    {
        super.OnBtnClick(ev)
        if (ev.target.name == "BtnStart")
        {
            console.log("start")
            
        }
        else if (ev.target.name == "BtnFriendMode")
        {
            UIMgr.Instance.ShowWind(CreateWind)
            //ModeMgr.Instance.GetMode<PrivRoomMode>(PrivRoomMode).SendJoinRoom(Number(this.TestBox.string))
        }
        else if (ev.target.name == "BtnBonusMode")
        {
            ModeMgr.Instance.GetMode<PrivRoomMode>(PrivRoomMode).SendUserReady()
            console.log("SendUserReady")
        }
    }

    public OnShown(param: any)
    {
        super.OnShown(param)
    }

    public OnHide()
    {
        super.OnHide()
    }

    public onDestroy()
    {
        
    }

}