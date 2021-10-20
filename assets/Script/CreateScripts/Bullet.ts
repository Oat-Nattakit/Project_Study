// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameControl, { TageType } from "./GameControl";
import { DEBUFF_Manager, Player_DEBUFF_Type, Power_management } from "./Power_management";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property(cc.Collider)
    private ObjCol: cc.Collider = null;

    @property(cc.Node)
    private SpritePic: cc.Node = null;

    @property(cc.ParticleSystem)
    private Patical_System: cc.ParticleSystem = null;

    public typeEn: boolean = false;

    private GetMainScripts: GameControl;
    private Power_Manage: DEBUFF_Manager;

    private Damage = 1;
    private Enemy_DeBuff_Type = 0;

    onLoad() {

        this.GetMainScripts = GameControl.Instance;
        this.Power_Manage = Power_management.instance().PlayerDEBUFF;
    }

    public EnemyBullet() {

        this.ObjCol.tag = TageType.Enemy;
        this.typeEn = true;
        this.node.group = 'Enemy';

        this.Power_Manage.SetNodeObject(this.SpritePic, this.Patical_System);
        this.Enemy_DeBuff_Type = this.Power_Manage.RandomPower();
    }

    start() {

        let Bullet_LimitMove = this.GetMainScripts.Canvas_Node.height * 0.5;

        if (this.typeEn == false) {

            this.SpritePic.color = cc.Color.GREEN;
            let Bullet_Player = cc.moveTo(1, this.node.x, Bullet_LimitMove);
            this.Bullet_Movement(Bullet_Player);
        }
        else {

            let Bullet_Enemy = cc.moveTo(1.5, this.GetMainScripts.Player_Obj.x * 0.9, -(Bullet_LimitMove));
            this.En_Bullet_LockTarget();
            this.Bullet_Movement(Bullet_Enemy);
        }
    }

    private En_Bullet_LockTarget() {
        let PlayerPos = this.GetMainScripts.Player_Obj;
        let diff = {
            'x': PlayerPos.x - this.node.x,
            'y': PlayerPos.y - this.node.y
        };
        let angle = Math.atan2(diff.x, diff.y) * 180 / Math.PI;
        this.node.runAction(cc.rotateTo(0, angle));
    }

    private Bullet_Movement(Move_Action: cc.ActionInterval) {

        let Move_OutRange = cc.sequence(Move_Action, cc.destroySelf());
        this.node.runAction(Move_OutRange);
    }

    onCollisionEnter(other, self) {

        if (other.tag == TageType.Player) {
            this.HitPlayer();
            this.SpawnEFX();
            this.node.destroy();
        }
        if (other.tag == TageType.Enemy) {
            this.SpawnEFX();
            this.node.destroy();
        }
        if (other.tag == TageType.Buff) {
            this.GetMainScripts.PowerManager.Player_Get_Buff();
            this.SpawnEFX();
            this.node.destroy();
        }
    }

    private HitPlayer() {

        cc.tween(this.GetMainScripts.Player_Obj)
            .to(0.1, { color: cc.Color.RED })
            .to(0.1, { color: cc.Color.WHITE })
            .start();

        this.Set_Debuff();
        this.GetMainScripts.Hit_and_GetHit_Ststus(false, this.Damage);
    }

    private Set_Debuff() {

        let Set_Debuff = this.GetMainScripts.PowerManager;

        if (this.Enemy_DeBuff_Type == Player_DEBUFF_Type.DEBUFF_DoubleDamage) {
            this.Damage = 2;
        }
        else {
            Set_Debuff.Debuff_Number = this.Enemy_DeBuff_Type;
        }
    }

    private SpawnEFX() {

        let EFX_ = cc.instantiate(this.GetMainScripts.Boom_EFX);
        EFX_.setParent(this.GetMainScripts.Canvas_Node);
        EFX_.setPosition(this.node.getPosition());

        let EFX_Action = cc.sequence(cc.delayTime(0.1), cc.destroySelf());
        EFX_.runAction(EFX_Action);
    }
}
