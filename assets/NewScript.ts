import { ResMgr } from "./YK/core/ResMgr/ResMgr";
import { SceneMgr } from "./YK/core/SceneMgr/SceneMgr";
import SceneTest from "./YK/New Folder/SceneTest";


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
export default class NewScript extends cc.Component
{
    @property(cc.Prefab)
    xx: cc.Prefab = null;

    asdas:cc.Node = null
    start()
    {
        this.asdas = new cc.Node("xxx")
        let sp = this.asdas.addComponent(cc.Sprite)
        let xx: cc.SpriteFrame = new cc.SpriteFrame("res/raw-internal/image/default_sprite_splash.png")
        //xx.setTexture(tex)
        sp.spriteFrame = xx
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM
        this.asdas.color = cc.Color.RED
        this.node.addChild(this.asdas)

        let ww = this.asdas.addComponent(cc.Widget)
        ww.bottom = 0
        ww.isAlignBottom = true
        ww.isAlignTop = true
        ww.isAlignLeft = true
        ww.isAlignRight = true
        ww.bottom = 0
        ww.top = 0
        ww.left = 0
        ww.right = 0
        //this.asdas.addComponent(cc.BlockInputEvents)
        let a = this.asdas.addComponent(cc.Button)
        this.asdas.on("click",function(){
            this.asdas.setSiblingIndex(0)
        },this)
        for (let i = 0; i < 5; i++)
        {

            let a = cc.instantiate(this.xx)
            this.node.addChild(a)
            a.active = true
            a.y = 30 * i
            a.x = 0
            a.on("click",this.click,this)
        }

        this.re()
    }

    private re()
    {
        let array:Array<cc.Color> = 
        [
            cc.Color.RED,
            cc.Color.BLUE,
            cc.Color.YELLOW,
            cc.Color.GREEN,
            cc.Color.ORANGE
        ]
        for (let i = 0; i < 5; i++)
        {
            this.node.children[i].color = array[i]
        }
    }

    private click(a:cc.Event.EventCustom)
    {
        
        // if(this.asdas.parent != null)
        // this.node.removeChild(this.asdas)
        // else
        // {
        //     this.node.insertChild(this.asdas,0)
        // }
    }
    // update (dt) {}
}
