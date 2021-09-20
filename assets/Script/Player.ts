// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameControl from "./GameControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.AudioSource)
    public SFX_: cc.AudioSource = null;

    private GetMainScripts: GameControl;      

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    }

    start() {
        this.GetMainScripts = GameControl.Instance;
    }    

    onCollisionEnter(other, self) {
        if (other.tag == 3) {
            //this.PlayerHealt_Hit();            
        }
    }

    private PlayerHealt_Hit() {   

        cc.tween(this.node)
        .to(0.1, { color : cc.Color.RED })
        .to(0.1, { color : cc.Color.WHITE})
        .start();

        //this.GetMainScripts.Hit_and_GetHit_Ststus(false);  
    }
}
