import { SceneBase } from "../../YK/core/SceneMgr/SceneBase";
import { EventData, Func } from "../../YK/core/EventMgr/DispatchEventNode";
import { MessageBox } from "../Winds/MessageBox";
import { UIMgr } from "../../YK/core/UIMgr/UIMgr";
import { MainWind } from "../Winds/MainWind";
import { FariendRoomPlayWind } from "../Winds/FariendRoomPlayWind";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendRoomPlayScene extends SceneBase
{
    protected firstWind: any = FariendRoomPlayWind
    protected OnInit(param: any)
    {
        super.OnInit(param)
        this.needLoadRes
            .add("prefab/MainScne/GameMode", false)
    }

    public StartGame()
    {
        UIMgr.Instance.CloseModalWait()
    }

    protected OnEnter(param: any)
    {
        super.OnEnter(param)
        this.StartGame()
    }

    protected OnHandler(ev: EventData)
    {
        super.OnHandler(ev)
    }

    protected OnLeave()
    {
        super.OnLeave()
    }

    protected OnDestroy()
    {
        super.OnDestroy()
    }

    protected OnLoaded()
    {
        super.OnLoaded()
    }

    protected OnTaskFinished()
    {
        super.OnTaskFinished()
    }
}
