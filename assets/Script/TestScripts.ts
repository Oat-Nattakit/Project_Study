// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;
@ccclass
export default class TestScripts extends cc.Component {

    @property(cc.Node)
    POsEn: cc.Node = null;

    @property(cc.Prefab)
    ENPre: cc.Prefab = null;

    PositionEn: cc.Vec2[] = null;     
}


