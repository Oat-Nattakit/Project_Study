// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameControl from "./GameControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property
    private Speed_Bul = 100;
    
    @property(cc.Collider)
    ObjCol: cc.Collider = null;

    public typeEn: boolean = false;

    private PlayerCon: cc.Node;
    private GetMainScripts: GameControl;    

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.GetMainScripts = GameControl.Instance;        
    }      

    update(dt) {
        if (this.typeEn == false) {
            this.node.y += this.Speed_Bul * (dt * 10);
        }
        else {
            this.node.y -= this.Speed_Bul * (dt * 10);
        }

        if(Math.abs(this.node.y) >= this.GetMainScripts.Canvas_Node.height * 0.6){                    
            this.node.destroy();
        }
    }

    onCollisionEnter(other, self) {
       
        if (other.tag == 3) {
            this.SpawnEFX();
            this.node.destroy();
        }
        if (other.tag == 1) {
            this.SpawnEFX();
            this.node.destroy();
        }
        if(other.tag == 4){            
            this.GetMainScripts.PowerUp.BuffPlayerActive();
            this.SpawnEFX();
            this.node.destroy();           
        }
    }

    private SpawnEFX() {
        let EFX_ = cc.instantiate(this.GetMainScripts.EFX);
        EFX_.setParent(this.GetMainScripts.Canvas_Node);
        EFX_.setPosition(this.node.getPosition());
        setTimeout(function () {
            EFX_.destroy()
        }.bind(this), 100);
    }    
}
