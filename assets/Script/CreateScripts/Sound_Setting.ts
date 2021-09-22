// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Default_Value_Setting } from "./Default_Value_Setting";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Sound_Setting extends cc.Component {

    @property(cc.AudioSource)
    public BMG_Sound: cc.AudioSource = null;

    @property(cc.AudioSource)
    public SFX_Sound: cc.AudioSource = null;

    @property(cc.Button)
    BMG_Button: cc.Button = null;

    @property(cc.Button)
    SFX_Button: cc.Button = null;

    private Mute_BMG_ST: Boolean = false;
    private Mute_SFX_ST: Boolean = false;

    private GetDef: Default_Value_Setting = null;

    onLoad() {        
        
        if(this.GetDef == null){
            this.GetDef = Default_Value_Setting.getInstance();
        }

        this.BMG_Button.node.on('click', this.Mute_BMG, this);
        this.SFX_Button.node.on('click', this.Mute_SFX, this);

        if (this.GetDef.Def_BMG == true) {
            this.Mute_BMG();
        }
        if (this.GetDef.Def_SFX == true) {

            this.Mute_SFX();
        }
    }

    private Mute_BMG() {
        
        if (this.Mute_BMG_ST == false) {

            this.BMG_Sound.volume = 0;
            this.BMG_Button.normalColor = cc.Color.RED;
            this.Mute_BMG_ST = this.GetDef.Set_Sound_Def_BGM(true);
        }
        else {

            this.BMG_Sound.volume = 0.1;
            this.BMG_Button.normalColor = cc.Color.GREEN;
            this.Mute_BMG_ST = this.GetDef.Set_Sound_Def_BGM(false);
        }
        this.BMG_Button.hoverColor = this.BMG_Button.normalColor;        
    }

    private Mute_SFX() {

        if (this.Mute_SFX_ST == false) {

            this.SFX_Sound.volume = 0;
            this.SFX_Button.normalColor = cc.Color.RED;            
            this.Mute_SFX_ST = this.GetDef.Set_Sound_Def_SFX(true);
        }
        else {

            this.SFX_Sound.volume = 1;
            this.SFX_Button.normalColor = cc.Color.GREEN;            
            this.Mute_SFX_ST = this.GetDef.Set_Sound_Def_SFX(false);
        }
        this.SFX_Button.hoverColor = this.SFX_Button.normalColor;        
    }
}
