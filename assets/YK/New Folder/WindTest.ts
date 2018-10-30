import { BaseUI, UIMgr } from "../core/UIMgr/UIMgr";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class WindTest extends BaseUI
{
    protected isDotDel = false
    public modal = true
    protected clickBbackgroundClose = true
    protected prefabUrl = "prefab/MessageBox/MessageBoxCommon"
    protected OnInit(param:any)
    {

    }

    protected OnBtnClick(ev:cc.Event.EventCustom)
    {
        //console.log(ev.target)
        UIMgr.Instance.DispatchEventByType("123","dsasddsasd")
    }
}
