import { SceneBase } from "../../YK/core/SceneMgr/SceneBase";
import { EventData, Func } from "../../YK/core/EventMgr/DispatchEventNode";
import { MessageBox } from "../Winds/MessageBox";
import { UIMgr } from "../../YK/core/UIMgr/UIMgr";
import { MainWind } from "../Winds/MainWind";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends SceneBase
{
    protected OnInit(param: any)
    {
        super.OnInit(param)
        this.needLoadRes
        .add("prefab/MainScne/CreateRoom", false)
        .add("prefab/MainScne/FrontCover", false)
    }

    public StartGame()
    {
        UIMgr.Instance.CloseModalWait()
        UIMgr.Instance.ShowWind(MainWind)
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
