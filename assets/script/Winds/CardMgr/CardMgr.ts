import { DDZLogic } from "../../Modes/DDZLogic";
import { CardItem } from "./CardItem";

export class CardMgr
{
    private cardSpriteFrames: Map<number, cc.SpriteFrame> = new Map<number, cc.SpriteFrame>()
    private static mInstance: CardMgr
    public static get Instance()
    {
        if (this.mInstance == null) new CardMgr()
        return this.mInstance
    }

    private mCardPools: cc.NodePool
    public Init(root: cc.Node)
    {
        this.cardSpriteFrames.clear()
        let prefab = root.children[0]
        root.children.forEach(element =>
        {
            let sp = element.getComponent(cc.Sprite)
            this.cardSpriteFrames.set(+element.name, sp.spriteFrame)
        });
        this.mCardPools = new cc.NodePool(CardItem)
        for (var index = 0; index < 120; index++)
        {
            let sp = cc.instantiate(prefab)
            sp.addComponent(CardItem)
            this.mCardPools.put(sp)
        }
    }
}