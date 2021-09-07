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

    PositionEn : cc.Vec2[] = null;    

    onLoad() {
        
        for (let i = 0; i < 30; i++) {
            var En = cc.instantiate(this.ENPre);
            En.parent = this.POsEn;               
        }
        setTimeout(function () {
            this.ShowPosition();
        }.bind(this), 0.1);

        console.log(this.POsEn.getComponent(cc.Layout).type);
        this.POsEn.getComponent(cc.Layout).type = cc.Layout.Type.NONE;
        console.log(this.POsEn.getComponent(cc.Layout).type);

    }

    ShowPosition(){
        this.PositionEn = new Array();

        for(let i=0 ; i<this.POsEn.childrenCount ; i++){
            this.PositionEn.push(this.POsEn.children[i].getPosition());           
        }
        this.ShowEiei();
    }

    ShowEiei(){
        for(let i=0 ; i<this.POsEn.childrenCount ; i++){
            this.POsEn.children[i].destroy();
        }
    }

    // update (dt) {}
}