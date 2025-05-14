import{
    Scene, 
    Engine, 
    FreeCamera,
    Vector3, 
    HemisphericLight, 
    SceneLoader,
    ArcRotateCamera,
    AbstractMesh,
    PhysicsImpostor,
    ActionManager,
    ExecuteCodeAction,
    MeshBuilder,
    StandardMaterial,
    Color3,
    CubeTexture,
    Texture,
    Vector2,
    PBRMaterial,
    Animation,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class IntroCutscene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: FreeCamera;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        //this.CreateSkybox();
        this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);

        this.CreateCutscene();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });
    }

    CreateScene(): Scene {
        this.engine.stopRenderLoop();
        const scene = new Scene(this.engine);
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,1), scene);
        hemiLight.intensity = 1;

        scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.engine.enterPointerlock();
            if (evt.button === 1) this.engine.exitPointerlock();
        };
        
        this.CreateCamera(scene);
        this.CreateMap();

        this.CreateReimu();
        
        window.addEventListener("resize", () => {
                this.engine.resize;
        });
        return scene;

    }

    async CreateMap(): Promise<void> {
        const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_hub_draft.glb");

        const rumia = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "rumia.glb"
        );
        rumia.meshes[0].scaling.setAll(0.4);
        rumia.meshes[0].position = new Vector3(78,8,-14);
        rumia.meshes[0].rotate(Vector3.Up(), 3.1);
        rumia.meshes[0].rotate(Vector3.Forward(), -Math.PI/16);
    }

    async CreateReimu(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(86,4,-14);
        this.Reimu.position._z += 0.5;
        this.Reimu.scaling.setAll(0.4); // Scales the mesh to half its original size
        this.Reimu.rotate(Vector3.Forward(), Math.PI/4);
        //this.camera.setTarget(meshes[2]);
        console.log("animations", animationGroups);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();


        let time = 0; 

        this.scene.onBeforeRenderObservable.add(() => {
            time++;
            /*
            if(time == 240) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: the recent days have been rough, but I can finally get some slee-"); 
                newDiv.appendChild(newContent);
            }
            if(time == 540) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("???: I finally found you, Reimu! i need your help!"); 
                newDiv.appendChild(newContent);
            }
            if(time == 840) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: Well, it was fun while it lasted."); 
                newDiv.appendChild(newContent);
            }
            if(time == 1080) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: what do you want, Rumia?"); 
                newDiv.appendChild(newContent);
            }
            if(time == 1200) {
                this.Reimu.rotate(Vector3.Forward(), -Math.PI/4);
                this.Reimu.position._z += 0.2;
            }
            if(time == 1320) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: I was supposed to play with Cirno today, but she is unable to wake up! Something must have happened to her!"); 
                newDiv.appendChild(newContent);
            }
            if(time == 1560) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: I admit, it's a little concerning. How long has she been asleep?"); 
                newDiv.appendChild(newContent);
            }
            if(time == 1800) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: Three days a least."); 
                newDiv.appendChild(newContent);
            }
            if(time == 2040) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: What?! And you haven't asked for help until now?"); 
                newDiv.appendChild(newContent);
            }
            if(time == 2280) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: The previous days, we weren't supposed to play."); 
                newDiv.appendChild(newContent);
            }
            if(time == 2520) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: I shouldn't be surprised with you, and surprisingly, I am!"); 
                newDiv.appendChild(newContent);
            }
            if(time == 2760) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: Can you help me, please?"); 
                newDiv.appendChild(newContent);
            }
            if(time == 3000) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: Fine, I will. But next time, ask for help sooner, okay?"); 
                newDiv.appendChild(newContent);
            }
            if(time == 3240) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: Yay! thank you, Reimu!"); 
                newDiv.appendChild(newContent);
            }*/
        })
        /*
        const flightSpeed = 0.2;
        const soarSpeed = 0.2;
        const focusFlightSpeed = 0.1;
        const rotationSpeed = 0.05;
        const normalAnimSpeed = 5;
        const focusAnimSpeed = 0.5;

        let speed: number;
        let animSpeed: number;
        let acceleration = 0;
        let soarAcceleration = 0;
        let rotationAcceleration = 0;

        const keyStatus = {
            z: false,
            s: false,
            q: false,
            d: false,
            c: false,
            v: false, 
            Shift: false
        };

        this.scene.actionManager = new ActionManager(this.scene);

        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, 
            (event) => {
                let key = event.sourceEvent.key;
                if (key !== "Shift") {
                    key = key.toLowerCase();
                }
                if (key in keyStatus) {
                    keyStatus[key as keyof typeof keyStatus] = true;
                }
            }
            )
        );

        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, 
            (event) => {
                let key = event.sourceEvent.key;
                if (key !== "Shift") {
                    key = key.toLowerCase();
                }
                if (key in keyStatus) {
                    keyStatus[key as keyof typeof keyStatus] = false;
                }
            }
            )
        );

        let moving = false;
        let soaring = false;
        let turning = false;
        let touched = 0;

        this.scene.onBeforeRenderObservable.add(() => {

            if(touched > 0) {
                    touched--;
                    this.Reimu.rotate(Vector3.Forward(), Math.PI/16);
            }
        else {
            if(keyStatus.z ||
            keyStatus.s ||
            keyStatus.q ||
            keyStatus.d ||
            keyStatus.c ||
            keyStatus.v) {
                moving = true;
                if(keyStatus.s && !keyStatus.z) {
                    acceleration = Math.max(acceleration-0.01, -flightSpeed);
                    this.Reimu.moveWithCollisions(this.Reimu.right.scaleInPlace(acceleration));
                }
                else if(keyStatus.z || keyStatus.q || keyStatus.d) {
                    speed = !keyStatus.Shift ? flightSpeed : focusFlightSpeed;
                    animSpeed = !keyStatus.Shift ? normalAnimSpeed : focusAnimSpeed;
                    flightAnim.speedRatio = animSpeed;
                    acceleration = Math.min(acceleration+0.01, speed);
                    this.Reimu.moveWithCollisions(this.Reimu.right.scaleInPlace(acceleration));
                }
                if(keyStatus.q) {
                    turning = true;
                    rotationAcceleration = Math.max(rotationAcceleration-0.002, -rotationSpeed);
                    this.Reimu.rotate(Vector3.Up(), rotationAcceleration);
                }
                else if(keyStatus.d) {
                    turning = true;
                    rotationAcceleration = Math.min(rotationAcceleration+0.002, rotationSpeed);
                    this.Reimu.rotate(Vector3.Up(), rotationAcceleration);
                }
                if(keyStatus.c) {
                    soaring = true;
                    soarAcceleration = Math.min(soarAcceleration+0.01, soarSpeed);
                    this.Reimu.moveWithCollisions(this.Reimu.up.scaleInPlace(soarAcceleration));
                }
                else if(keyStatus.v) {
                    soaring = true;
                    soarAcceleration = Math.max(soarAcceleration-0.01, -soarSpeed);
                    this.Reimu.moveWithCollisions(this.Reimu.up.scaleInPlace(soarAcceleration));
                }
                flightAnim.start(
                    true, 
                    1, 
                    flightAnim.from, 
                    flightAnim.to, 
                    false
                );
            }
            else  {
                if(moving) {
                    idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
                    acceleration = 0;
                    flightAnim.stop();
                    moving = false; 
                }
            }
            if(!keyStatus.z && !keyStatus.s) {
                if(acceleration > 0) acceleration = Math.max(acceleration-0.01, 0);
                else if(acceleration < 0) acceleration = Math.min(acceleration+0.01, 0);
            }
            if(!keyStatus.q && !keyStatus.d) {
                if(rotationAcceleration > 0) rotationAcceleration = Math.max(rotationAcceleration-0.002, 0);
                if(rotationAcceleration < 0) rotationAcceleration = Math.min(rotationAcceleration+0.002, 0);

            }
            if(!keyStatus.c && !keyStatus.v) {
                if(soarAcceleration > 0) soarAcceleration = Math.max(soarAcceleration-0.01, 0);
                if(soarAcceleration < 0) soarAcceleration = Math.min(soarAcceleration+0.01, 0);

            }
        }
        });*/
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(83,8,-11), scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/4,5*Math.PI/8,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Reimu: *sigh* I finally get to relax!");
        newDiv.appendChild(newContent);
    
        newDiv.style.position= 'absolute';
        newDiv.style.top= '60%';
        newDiv.style.right= '32%';
        newDiv.style.margin= 'auto';
        newDiv.style.background= 'linear-gradient(rgba(255, 255, 255, 0.93), rgba(135, 135, 135, 0.8))';
        newDiv.style.fontSize= '20px';
        newDiv.style.width= '500px';
        newDiv.style.height= '150px';
        newDiv.style.borderRadius= '20px';
        newDiv.style.textAlign= 'center';
        newDiv.style.alignContent= 'center';
        newDiv.style.borderColor= 'red';
        newDiv.style.borderStyle= 'ridge ';
        newDiv.style.fontFamily= 'Lucida Console';
        document.body.appendChild(newDiv); 

        const camkeys = [];
        const camAnim = new Animation(
            "camAnim", 
            "position",
            fps,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            true
        );

        const rotkeys = [];
        const rotationAnim = new Animation(
            "rotationAnim",
            "rotation",
            fps,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            true
        );

        camkeys.push({frame:0, value:new Vector3(83,8,-11)});
        camkeys.push({frame:4*fps, value:new Vector3(83,8,-11)});
        camkeys.push({frame:10*fps, value:new Vector3(77,12,-11)});

        camkeys.push({frame:18*fps, value:new Vector3(77,12,-11)});
        camkeys.push({frame:20*fps, value:new Vector3(81,8,-12)});

        camkeys.push({frame:34*fps, value:new Vector3(81,8,-12)});
        camkeys.push({frame:36*fps, value:new Vector3(87,5,-11)});

        camkeys.push({frame:46*fps, value:new Vector3(87,5,-11)});
        camkeys.push({frame:48*fps, value:new Vector3(82,7,-6)});


        rotkeys.push({frame:0, value:new Vector3(Math.PI/4,5*Math.PI/8,0)});
        rotkeys.push({frame:18*fps, value:new Vector3(Math.PI/4,5*Math.PI/8,0)});
        rotkeys.push({frame:20*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});

        rotkeys.push({frame:46*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
        rotkeys.push({frame:48*fps, value:new Vector3(0,Math.PI,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);

        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        setTimeout(() => {
            this.scene.beginAnimation(this.camera,0,48*fps);
        }, 1000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: the recent days have been rough, but I can finally get some slee-"); 
            newDiv.appendChild(newContent);
        }, 5000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("???: I finally found you, Reimu! i need your help!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'black';
        }, 10000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Well, it was fun while it lasted."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
        }, 15000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: what do you want, Rumia?"); 
            newDiv.appendChild(newContent);
        }, 19000);

        setTimeout(() => {
            this.Reimu.rotate(Vector3.Forward(), -Math.PI/4);
            this.Reimu.position._z += 0.2;
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Rumia: I was supposed to play with Cirno today, but she is unable to wake up! Something must have happened to her!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'black';
        }, 23000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: I admit, it's a little concerning. How long has she been asleep?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
        }, 27000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Rumia: Three days a least."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'black';
        }, 31000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: What?! And you haven't asked for help until now?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
        }, 35000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Rumia: The previous days, we weren't supposed to play."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'black';
        }, 39000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: I shouldn't be surprised with you, and surprisingly, I am!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
        }, 43000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Rumia: Can you help me, please?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'black';
        }, 47000);

        setTimeout(() => {
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Fine, I will. But next time, ask for help sooner, okay?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
        }, 51000);

        setTimeout(() => {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: Yay! thank you, Reimu!"); 
                newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'black';
        }, 55000);

        /*
            if(time == 840) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: Well, it was fun while it lasted."); 
                newDiv.appendChild(newContent);
            }
            if(time == 1080) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: what do you want, Rumia?"); 
                newDiv.appendChild(newContent);
            }
            if(time == 1200) {
                this.Reimu.rotate(Vector3.Forward(), -Math.PI/4);
                this.Reimu.position._z += 0.2;
            }
            if(time == 1320) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: I was supposed to play with Cirno today, but she is unable to wake up! Something must have happened to her!"); 
                newDiv.appendChild(newContent);
            }
            if(time == 1560) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: I admit, it's a little concerning. How long has she been asleep?"); 
                newDiv.appendChild(newContent);
            }
            if(time == 1800) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: Three days a least."); 
                newDiv.appendChild(newContent);
            }
            if(time == 2040) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: What?! And you haven't asked for help until now?"); 
                newDiv.appendChild(newContent);
            }
            if(time == 2280) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: The previous days, we weren't supposed to play."); 
                newDiv.appendChild(newContent);
            }
            if(time == 2520) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: I shouldn't be surprised with you, and surprisingly, I am!"); 
                newDiv.appendChild(newContent);
            }
            if(time == 2760) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: Can you help me, please?"); 
                newDiv.appendChild(newContent);
            }
            if(time == 3000) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Reimu: Fine, I will. But next time, ask for help sooner, okay?"); 
                newDiv.appendChild(newContent);
            }
            if(time == 3240) {
                newDiv.removeChild(newContent);
                newContent = document.createTextNode("Rumia: Yay! thank you, Reimu!"); 
                newDiv.appendChild(newContent);
            }*/
    }
}