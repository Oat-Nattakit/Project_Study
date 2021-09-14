// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;
@ccclass
export default class TestScripts extends cc.Component {

    @property(cc.Label)
    private GetLabel: cc.Label = null;

    Getsc: SetValue;
    Random_Rate = [10, 40, 50];

    @property(cc.Node)
    NodeObj: cc.Node = null;

    @property(cc.Node)
    MoveNodeObj: cc.Node = null;

    @property(cc.Node)
    CanVasNode: cc.Node = null;

    onLoad() {

        this.Getsc = new SetValue(this.GetLabel);
        this.Getsc.settingtext();
    }

    start() {

        let rotm = cc.rotateBy(2.5,-360).repeatForever();
        let rot = cc.repeatForever(rotm);

        this.MoveNodeObj.runAction(rot);

    }
}


class SetValue {

    LAbelString: cc.Label;

    constructor(llll: cc.Label) {
        this.LAbelString = llll;
    }

    settingtext() {
        this.LAbelString.string = "Yep";
    }


}