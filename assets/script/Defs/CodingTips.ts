export type test = 
{
	/**测试字符串**/
	str:string,
}
export type packbase = 
{
	/**协议id**/
	cmd:number,
	/**消息唯一序号**/
	msgid:number,
	/**错误代码**/
	errorcode:number,
	/**包体内容**/
	contentBuff:any,
}
export type UserData = 
{
	/**角色id**/
	roleId:number,
	/**角色名称**/
	nickName:string,
	/**头像**/
	headUrl:string,
	/**性别 1为男性，2为女性**/
	sex:number,
	/**个性签名**/
	signature:string,
	/**星座**/
	constellation:number,
	/**城市(暂定城市编号)**/
	county:string,
	/**城市(暂定城市编号)**/
	city:string,
	/**微信号**/
	weChat:string,
	/**金币**/
	gold:number,
	/**砖石**/
	diamond:number,
	/**闯关数**/
	playerNum:number,
	/**通关数**/
	winNum:number,
	/**总奖金**/
	awardNum:string,
}
export type loginReq = 
{
	/**登陆令牌**/
	token:string,
	/**角色id**/
	roleid:number,
}
export type loginResp = 
{
	/**角色信息**/
	roleinfo:UserData,
}
export type tickOutEvent = 
{
	/**踢出原因1.账号被挤**/
	tickType:number,
}
export type ParamConfig = 
{
	/**参数名**/
	name:string,
	/**参数值**/
	value:number,
}
export type PrivateRoomInfo = 
{
	/**玩家可以制定的参数json格式11**/
	param:Array<ParamConfig>,
	/**真实的房间id(服务端返回)**/
	roomid:number,
	/**房主玩家id**/
	ownerid:number,
	/**创建的包厢局数**/
	dealNum:number,
	/**玩家人数**/ 
	roleNum:number,
	/**游戏id**/
	gameid:number,
}
export type roomIdData = 
{
	/**房间id**/
	roomId:number,
}
export type PrivateDeskInfoReply = 
{
	/**当前局数**/
	dealId:number,
	/**当前状态None=0  ReadyBegin=1, Gameing=2, GameEnd=3**/
	state:number,
	/**庄家**/
	banker:number,
	/**玩家牌數據及得分**/
	matchPlayers:Array<MatchPlayer>,
	/**当前操作玩家**/
	curSeat:number,
	/**三张底牌**/
	lowCards:Array<number>,
	/**当前倍数**/
	nowMultiple:number,
	/**玩家最後一次操作**/
	opInfos:Array<OpEvent>,
	/**None = 1 叫分 =2, 叫地主=3  抢地主=4**/
	dzState:number,
	/**房间创建参数**/
	roomInfo:PrivateRoomInfo,
}
export type MatchPlayer = 
{
	/**座位**/
	seat:number,
	/**得分**/
	score:number,
	/**手牌**/
	cards:Array<number>,
	/**剩余牌张数 (如是暗牌，則通過本數值顯示牌數量)**/
	cardsNum:number,
	/**是否地主**/
	isDZ:boolean,
	/**打出炸弹数**/
	boomNums:number,
	/**打出的所有牌(可用于客户端记牌)(重连时下发)**/
	outCards:Array<number>,
	/**玩家基础数据**/
	userData:UserData,
	/**玩家状态**/
	state:number,
}
export type CallOpInfo = 
{
	/**座位**/
	seat:number,
	/**操作值**/
	value:number,
}
export type OpReq = 
{
	/**操作类型**/
	weaveKind:number,
	/**操作值**/
	value:number,
	/**操作牌(如果有)**/
	cards:Array<number>,
}
export type OpEvent = 
{
	/**操作类型**/
	weaveKind:number,
	/**操作值**/
	value:number,
	/**操作座位**/
	seat:number,
	/**操作牌(如果有)**/
	cards:Array<number>,
}
export type GameStartEvent = 
{
	/**玩家牌數據及得分**/
	matchPlayers:Array<MatchPlayer>,
	/**当前操作玩家**/
	curSeat:number,
	/**当前游戏状态**/
	dzState:number,
	/**底牌**/
	lowCards:Array<number>,
	/**癞子牌**/
	laizIndex:number,
}
export type opData = 
{
	/**操作特殊标识值**/
	state:number,
}
export type DissRoleRep = 
{
	/**玩家id**/
	id:number,
	/**玩家昵称**/
	nickname:string,
	/**状态。0未答复 1.同意 2,.不同意**/
	agree:number,
	/**是否发起人**/
	suggest:boolean,
}
export type DissRoomData = 
{
	/**解散的玩家状态**/
	roles:Array<DissRoleRep>,
	/**是否解散  0.未出结果 1.解散 2.不解散**/
	state:number,
	/**剩余倒计时 type=1时有效**/
	endtime:number,
	/**0.未解散 1.玩家解散  2.游戏结束解散 3.定时器解散**/
	type:number,
}
export type GameOverPlayerData = 
{
	/**座位**/
	seat:number,
	/**手牌**/
	cards:Array<number>,
	/**本局分数**/
	curScore:number,
	/**总分数**/
	score:number,
	/**炸弹数**/
	boom:number,
	/**结束状态 0.無 1.春天 2.包賠**/
	overState:number,
}
export type ParamConfigList = 
{
	/**参数列表**/
	datas:Array<ParamConfig>,
}
