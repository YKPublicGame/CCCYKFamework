import { DispatchEventNode, Func } from "../EventMgr/DispatchEventNode";



class ResInfo
{
    public url;
    public isKeepMemory = false
    public asset;
}
type resDicType = { [key: string]: ResInfo }
export class LoadGruopInfo
{
    public Progress: number = 0
    public needLoad: Array<ResInfo> = new Array<ResInfo>()
    public add(url: string, isKeepMemory = false)
    {
        let index = this.needLoad.findIndex((value: ResInfo, index: number, obj: Array<ResInfo>) =>
        {
            return value.url == url
        })
        if (index == -1)
        {
            let info = new ResInfo()
            info.isKeepMemory = isKeepMemory
            info.url = url
            this.needLoad.push(info)
        }
        return this
    }

    public onCompletion(callback: Function, thisObjs: any)
    {
        this.finish = new Func(thisObjs, callback)
        return this
    }

    public onItemCompletion(callback: Function, thisObjs: any)
    {
        this.loadItem = new Func(thisObjs, callback)
        return this
    }


    public start()
    {
        ResMgr.Instance.LoadGroup(this)
    }
    public loadItem: Func
    public finish: Func
}


export class ResMgr extends DispatchEventNode
{
    private mOldRes: Array<string> = new Array<string>()
    private resDic: Map<string, ResInfo> = new Map<string, ResInfo>()
    private static mInstance: ResMgr = null
    public static get Instance(): ResMgr
    {
        if (this.mInstance == null)
        {
            let no = new cc.Node("ResMgr")
            cc.game.addPersistRootNode(no);
            this.mInstance = no.addComponent(ResMgr)
        }
        return this.mInstance
    }

    public GetRes(url)
    {
        return cc.loader.getRes(url)
    }

    public LoadGroup(loads: LoadGruopInfo)
    {
        let urls: Array<string> = new Array<string>()
        loads.needLoad.forEach(element =>
        {
            urls.push(element.url)
        });
        cc.loader.loadResArray(urls, (completedCount: number, totalCount: number, item: cc.Asset) =>
        {
            loads.Progress = completedCount / totalCount * 100
            if (loads.loadItem != null)
            {
                loads.loadItem.Invoke(completedCount, totalCount, item)
            }
        }, ((error: Error, resource: any[]) =>
        {
            if (error == null)
            {
                for (let index = 0; index < resource.length; index++)
                {
                    let element = resource[index];
                    let info = loads.needLoad[index]
                    info.asset = element
                    if (!this.resDic.has(info.url))
                    {
                        this.resDic.set(info.url, info)
                    }
                }
            }
            else
            {
                console.error(error)
            }
            if (loads.finish != null)
            {
                loads.finish.Invoke(error)
            }
        }))
    }

    /**
     * 释放资源
     * @param forced 是否强制释放所有
     */
    public pop(forced = false)
    {
        if (forced)
        {
            this.mOldRes.splice(0, this.mOldRes.length)

            this.resDic.forEach((v: ResInfo, key: string) =>
            {
                this.mOldRes.push(key)
            });
            this.resDic.clear()
        }
        else
        {
            this.mOldRes.forEach(element =>
            {
                this.resDic.delete(element)
            });
        }
        while (this.mOldRes.length > 0)
        {
            let url = this.mOldRes.pop()
            cc.loader.release(url)
        }
    }

    /**
     * 压入要释放的资源
     */
    public push()
    {
        this.resDic.forEach((v: ResInfo, key: string) =>
        {
            if (!v.isKeepMemory)
                this.mOldRes.push(key)
        });
    }
}
