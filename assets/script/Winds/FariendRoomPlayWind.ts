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
import { PrivRoomMode } from "../Modes/PrivRoomMode";
import { ProtocolDef, ActionType, ErrorCode } from "../Defs/ProtocolDef";

export class FariendRoomPlayWind extends BaseUI
{

    public modal: boolean = true
    public dontDel: boolean = false
    public prefabUrl = "prefab/MainScne/GameMode"
    protected clickBbackgroundClose = false

    protected OnInit(param: any)
    {
        super.OnInit(param)
        this.eventMgr.setNetCallback(this.OnNetMsg)

    }

    protected OnBtnClick(ev: cc.Event.EventCustom)
    {
        super.OnBtnClick(ev)
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

    protected OnHandler(ev: EventData)
    {
    }

    protected OnNetMsg(ev: ResponseMessageEvent)
    {
    }
}