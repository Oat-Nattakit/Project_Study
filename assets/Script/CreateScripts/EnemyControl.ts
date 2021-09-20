// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import GameControl from "./GameControl";
const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyControl extends cc.Component {

    private GetMainScripts: GameControl;

    onLoad() {

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.GetMainScripts = GameControl.Instance;
    }

    onCollisionEnter(other, self) {

        if (other.tag == 2) {
                        
            this.GetMainScripts.GetPosition_StandbyPush(this.node.getPosition());
            this.node.destroy();
            this.GetMainScripts.CallScore();
        }
    }

    public En_Bullect() {

        let Bullect_ = cc.instantiate(this.GetMainScripts.Prefabs_Bullet);        
        Bullect_.parent = this.GetMainScripts.Canvas_Node;
        Bullect_.setPosition(this.node.x, this.node.y - 100);

        let ScriptsBullect = Bullect_.getComponent(Bullet);
        ScriptsBullect.EnemyBullet();        
    }
}
