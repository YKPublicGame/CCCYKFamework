import { SceneBase } from "../core/SceneMgr/SceneBase";
import { ITask } from "../core/Task/TaskBase";
import { TimeDelay } from "../core/Util/TimeDelay";
import { ResMgr } from "../core/ResMgr/ResMgr";
import WindTest from "./WindTest";
import { EventData } from "../core/EventMgr/DispatchEventNode";

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
export default class SceneTest extends SceneBase 
{
    protected firstWind = WindTest;
    protected OnEnter(param:any)
    {
        let xx = ResMgr.Instance.GetRes("btn1")
        super.OnEnter(param)
    }

    protected OnInit(param:any)
    {
        this.needLoadRes.add("prefab/MessageBox/MessageBoxCommon")
    }

    protected OnHandler(ev:EventData)
    {
        ev.Stop()
    }

    protected OnHandler1(ev:EventData)
    {
        console.log(ev.data)
    }
}

class testTask implements ITask
{
    public IsRuning: boolean = false;
    public Id: number = -1;
    public IsDone: boolean = false;
    public Error: string = null;
    public TaskName()
    {
        return "测试"
    }
    public OnExecute ()
    {
        this.IsRuning = true
        this.IsDone = true
        this.Error = null
        TimeDelay.Instance.Add(0.3,1,(a)=>
        {
            this.IsRuning = false
        },this)
        console.log("测试任务"+this.Id)
    }

    public Reset()
    {

    }

}