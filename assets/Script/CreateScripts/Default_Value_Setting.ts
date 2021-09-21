// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export class Default_Value_Setting {

    private static _instance: Default_Value_Setting = new Default_Value_Setting();

    public Def_Speed = null;
    public Def_FireRate = null;

    public Def_BMG: Boolean = null;
    public Def_SFX: Boolean = null;

    constructor() {        
        Default_Value_Setting._instance = this;
    }

    public static getInstance(): Default_Value_Setting {
        return Default_Value_Setting._instance;
    }

    public Player_Def_Value(St_Speed, St_Firerate) {
        this.Def_Speed = St_Speed;
        this.Def_FireRate = St_Firerate;
    }

    public Sound_Def_BGM(BMG_Vol: Boolean) {
        this.Def_BMG = BMG_Vol;
        return this.Def_BMG;

    }
    public Sound_Def_SFX(SFX_Vol: Boolean) {
        this.Def_SFX = SFX_Vol;
        return this.Def_SFX;
    }
}
