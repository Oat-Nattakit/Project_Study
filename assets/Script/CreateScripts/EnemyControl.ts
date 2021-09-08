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

    private PlayerCon: cc.Node;
    private GetMainScripts: GameControl;

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.PlayerCon = cc.find("ObjectController");
        this.GetMainScripts = this.PlayerCon.getComponent(GameControl);
    }    

    onCollisionEnter(other, self) {
        if (other.tag == 2) {
            this.GetMainScripts.EN_SpawnPos.push(this.node.getPosition());
            this.node.destroy();
            this.GetMainScripts.CallScore();
        }
    }

    public En_Bullect() {
        let Bullect_ = cc.instantiate(this.GetMainScripts.Prefabs_Bullet);
        Bullect_.color = cc.Color.RED;
        Bullect_.parent = this.GetMainScripts.Canvas_Node;
        Bullect_.setPosition(this.node.x, this.node.y - 100);
        Bullect_.getComponent(Bullet).ObjCol.tag = 3;
        Bullect_.getComponent(Bullet).typeEn = true;
        Bullect_.getComponent(Bullet).node.group = 'Enemy';        
    }
}
