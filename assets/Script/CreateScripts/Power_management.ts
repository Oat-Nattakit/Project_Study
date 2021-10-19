// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

export class Power_management {

    private static Power_Manage: Power_management = new Power_management();

    public PlayerBUFF: BUFF_Manager;
    public PlayerDEBUFF: DEBUFF_Manager;

    constructor() {
        Power_management.Power_Manage = this;
    }

    public static instance(): Power_management {
        Power_management.Power_Manage.Active_PowerManage();
        return Power_management.Power_Manage;
    }

    Active_PowerManage() {

        this.PlayerBUFF = new BUFF_Manager();
        this.PlayerDEBUFF = new DEBUFF_Manager();
    }
}

interface Power_Pattern {

    Max_Rate: number;
    Power_Number: number;
    Random_Rate: Int32List;
    RandomPower(): void;
}

enum Player_Buff {

    BUFF_Defult = -1,
    BUFF_PlusHealth = 0,
    BUFF_Shild = 1,
    BUFF_FireRate = 2,
    BUFF_Speed = 3,
}

enum Player_DeBuff {

    DEBUFF_Defult = 0,
    DEBUFF_DoubleDamage = 1,
    DEBUFF_FireRate = 2,
    DEBUFF_Speed = 3,
}

abstract class BUFF_Random implements Power_Pattern {

    Max_Rate: number;
    Power_Number: number;
    Random_Rate: Int32List;

    BUFF = Player_Buff;
    private HP_Max: boolean = false;
    private Shild_Active: boolean = false;

    constructor() {

        this.Max_Rate = 100;
        this.Power_Number = 0;
        this.Random_Rate = [10, 20, 60];
        this.HP_Max = false;
        this.Shild_Active = false;
    }

    public CheckStatus_Buff_Active(HP_Status: boolean, Shild_Status: boolean) {

        this.HP_Max = HP_Status;
        this.Shild_Active = Shild_Status;

        if (this.HP_Max == true) {
            this.Random_Rate[1] = this.Random_Rate[1] - this.Random_Rate[0];
            this.Random_Rate[2] = this.Random_Rate[2] - this.Random_Rate[0];
            this.Random_Rate[0] = this.BUFF.BUFF_Defult;
        }
        if (this.Shild_Active == true) {
            this.Random_Rate[2] = this.Random_Rate[2] - this.Random_Rate[1];
            this.Random_Rate[1] = this.BUFF.BUFF_Defult;
        }
    }

    public RandomPower() {

        let Random_Value = Math.floor(Math.random() * this.Max_Rate);
        this.Power_Number = this.BUFF.BUFF_Defult;

        if (Random_Value > 0 && Random_Value <= this.Random_Rate[0]) {
            this.Power_Number = this.BUFF.BUFF_PlusHealth;
        }
        else if (Random_Value > 0 && Random_Value > this.Random_Rate[0] && Random_Value <= this.Random_Rate[1]) {
            this.Power_Number = this.BUFF.BUFF_Shild;
        }
        else if (Random_Value > this.Random_Rate[1] && Random_Value <= this.Random_Rate[2]) {
            this.Power_Number = this.BUFF.BUFF_FireRate;
        }
        else if (Random_Value >= this.Random_Rate[2]) {
            this.Power_Number = this.BUFF.BUFF_Speed;
        }
        return this.Power_Number;
    }
}

export class BUFF_Manager extends BUFF_Random {

    RangeWidth: number;
    RangeHight: number;

    constructor() {
        super();
    }

    public SetRange(Width, Hight) {
        this.RangeWidth = Width;
        this.RangeHight = Hight;
    }

    public Random_Silde_Spawn(BUFF_OBJ: cc.Node) {

        let Ran_Num = Math.floor(Math.random() * 2);
        let Spawn_R_Side = false;

        if (Ran_Num == 0) {
            BUFF_OBJ.setPosition(-this.RangeWidth, this.RangeHight);
            Spawn_R_Side = true;
        }
        else {
            BUFF_OBJ.setPosition(this.RangeWidth, this.RangeHight);
            Spawn_R_Side = false;
        }
        return Spawn_R_Side;
    }

    public BuffObject_Movement(BUFF_OBJ: cc.Node) {

        let Curve_Time = 0.5;
        let Scale_resize = cc.sequence(cc.scaleTo(0.4, 1.3, 1.3), cc.scaleTo(0.4, 0.8, 0.8)).repeatForever();
        BUFF_OBJ.runAction(Scale_resize);

        let Swing_Movement = 50;
        let SwingUp = cc.moveBy(Curve_Time, BUFF_OBJ.x, BUFF_OBJ.y + Swing_Movement)
        let SwingDown = cc.moveBy(Curve_Time, BUFF_OBJ.x, BUFF_OBJ.y - Swing_Movement)

        let BuffSwing_Move = cc.sequence(SwingUp, SwingDown).repeatForever();
        BUFF_OBJ.runAction(BuffSwing_Move);
    }
}

export class DEBUFF_Manager implements Power_Pattern {

    Max_Rate: number;
    Power_Number: number;
    Random_Rate: Int32List;

    DEBUFF = Player_DeBuff;
    SpritePic: cc.Node;
    Patical_System: cc.ParticleSystem;

    constructor() {
        this.Max_Rate = 100;
        this.Power_Number = 0;
        this.Random_Rate = [5, 10, 15, 100];
    }

    public SetNodeObject(Sprite: cc.Node, Patical: cc.ParticleSystem) {
        this.SpritePic = Sprite;
        this.Patical_System = Patical;
    }

    public RandomPower() {

        this.Patical_System.enabled = true;

        let Random_Value = Math.floor(Math.random() * this.Max_Rate);
        this.Power_Number = this.DEBUFF.DEBUFF_Defult;

        if (Random_Value <= this.Random_Rate[0]) {
            this.SpritePic.color = cc.Color.BLUE;
            this.Power_Number = this.DEBUFF.DEBUFF_DoubleDamage;
        }
        else if (Random_Value > this.Random_Rate[0] && Random_Value <= this.Random_Rate[1]) {
            this.SpritePic.color = cc.Color.YELLOW;
            this.Power_Number = this.DEBUFF.DEBUFF_FireRate;
        }
        else if (Random_Value > this.Random_Rate[1] && Random_Value <= this.Random_Rate[2]) {
            this.SpritePic.color = cc.Color.MAGENTA;
            this.Power_Number = this.DEBUFF.DEBUFF_Speed;
        }
        else {
            this.Patical_System.enabled = false;
            this.SpritePic.color = cc.Color.RED;
        }
        return this.Power_Number;
    }
}

