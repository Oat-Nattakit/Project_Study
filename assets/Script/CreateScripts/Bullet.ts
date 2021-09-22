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

    @property(cc.Collider)
    private ObjCol: cc.Collider = null;

    @property(cc.Node)
    private SpritePic: cc.Node = null;

    @property(cc.ParticleSystem)
    private Patical_Sy: cc.ParticleSystem = null;


    public typeEn: boolean = false;

    private GetMainScripts: GameControl;
    private Bullet_LimitMove = 0;
    private Damage = 1;
    private Enemy_DeBuff_Type = 0;

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.GetMainScripts = GameControl.Instance;

        this.Bullet_LimitMove = this.GetMainScripts.Canvas_Node.height * 0.5;
    }

    public EnemyBullet() {

        this.ObjCol.tag = 3;
        this.typeEn = true;
        this.Random_Buff_Bullet();
        this.node.group = 'Enemy';
    }

    start() {
        if (this.typeEn == false) {
            this.SpritePic.color = cc.Color.GREEN;
            let Bullet_Player = cc.moveTo(1, this.node.x, this.Bullet_LimitMove);
            this.Bullet_Movement(Bullet_Player);
        }
        else {            
            let Bullet_Enemy = cc.moveTo(1.5, this.GetMainScripts.Player_Obj.x*0.9, -(this.Bullet_LimitMove));
            this.Bullet_Movement(Bullet_Enemy);
        }
    }

    private Bullet_Movement(Move_Action: cc.ActionInterval) {

        let Move_OutRange = cc.sequence(Move_Action, cc.destroySelf());
        this.node.runAction(Move_OutRange);
    }

    onCollisionEnter(other, self) {

        if (other.tag == 3) {
            this.SpawnEFX();
            this.node.destroy();
        }
        if (other.tag == 1) {
            this.HitPlayer();
            this.SpawnEFX();
            this.node.destroy();
        }
        if (other.tag == 4) {
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

        this.Enemy_Buff_Bullet();
        this.GetMainScripts.Hit_and_GetHit_Ststus(false, this.Damage);
    }

    private Random_Buff_Bullet() {

        let Rate_Buff = [5, 10, 15, 100];

        let RandomBuff = Math.floor(Math.random() * 100);           
        this.Patical_Sy.enabled = true;

        if (RandomBuff <= Rate_Buff[0]) {
            this.SpritePic.color = cc.Color.BLUE;
            this.Enemy_DeBuff_Type = 1;
        }
        else if (RandomBuff > Rate_Buff[0] && RandomBuff <= Rate_Buff[1]) {
            this.SpritePic.color = cc.Color.YELLOW;
            this.Enemy_DeBuff_Type = 2;
        }
        else if (RandomBuff > Rate_Buff[1] && RandomBuff <= Rate_Buff[2]) {
            this.SpritePic.color = cc.Color.MAGENTA;
            this.Enemy_DeBuff_Type = 3;
        }
        else {            
            this.Patical_Sy.enabled = false;
            this.SpritePic.color = cc.Color.RED;
        }             
    }

    private Enemy_Buff_Bullet() {

        let Set_Debuff = this.GetMainScripts.PowerManager;
        
        if (this.Enemy_DeBuff_Type == 1) {
            this.Damage = 2;
        }
        else{            
            Set_Debuff.Debuff_Number = this.Enemy_DeBuff_Type;
        }        
    }

    private SpawnEFX() {

        let EFX_ = cc.instantiate(this.GetMainScripts.Boom_EFX);
        EFX_.setParent(this.GetMainScripts.Canvas_Node);
        EFX_.setPosition(this.node.getPosition());

        let EFX_Action = cc.sequence(cc.delayTime(0.1),cc.destroySelf());
        EFX_.runAction(EFX_Action);       
    }
}
