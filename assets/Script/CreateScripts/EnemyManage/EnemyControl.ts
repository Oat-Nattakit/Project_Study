// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "../Bullet";
import GameControl, { TageType } from "../GameControl";


const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyControl extends cc.Component {

    private GetMainScripts: GameControl; 

    onLoad() {
        
        this.GetMainScripts = GameControl.Instance;
    }

    onCollisionEnter(other, self) {

        if (other.tag == TageType.Bullet) {                                    
           
            this.GetMainScripts.SpawnEnemy.PushPositionEnemy(this.node.getPosition());
            this.node.destroy();
            this.GetMainScripts.CallScore();
        }
    }

    public En_Bullect() {

        let Distance_Node = 100;
        let Bullect_ = cc.instantiate(this.GetMainScripts.Prefabs_Bullet);        
        Bullect_.parent = this.GetMainScripts.Canvas_Node;
        Bullect_.setPosition(this.node.x, this.node.y - Distance_Node);

        let ScriptsBullect = Bullect_.getComponent(Bullet);
        ScriptsBullect.EnemyBullet();        
    }
}
