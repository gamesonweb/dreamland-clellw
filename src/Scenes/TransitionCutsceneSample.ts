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

export class TransitionCutscene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: FreeCamera;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateSkybox();
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
        hemiLight.intensity = 1.5;

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

        const doremy = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "doremy.glb"
        );
        doremy.meshes[0].scaling.setAll(0.4);
        doremy.meshes[0].position = new Vector3(69,0,16);
        doremy.meshes[0].rotate(Vector3.Up(), 3.1);
        doremy.meshes[0].rotate(Vector3.Up(), 5*Math.PI/4);
        
        const nazrin = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "nazrin.glb"
        );
        nazrin.meshes[0].scaling.setAll(0.4);
        nazrin.meshes[0].position = new Vector3(66,0,18);
        nazrin.meshes[0].rotate(Vector3.Up(), 3.1);
        nazrin.meshes[0].rotate(Vector3.Forward(), -Math.PI/2);
    }

    async CreateReimu(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(69,0,19);
        this.Reimu.position._z += 0.5;
        this.Reimu.scaling.setAll(0.4); 
        this.Reimu.rotate(Vector3.Up(), -Math.PI/4);
        //this.camera.setTarget(meshes[2]);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();

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
        this.camera = new FreeCamera("camera", new Vector3(63,5,18), scene);
        this.camera.checkCollisions = true;
        this.camera.attachControl(true);
        this.camera.rotation = new Vector3(Math.PI/4,Math.PI/2,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        const newContent = document.createTextNode("Reimu: *sigh* I finally get to relax!");
        newDiv.appendChild(newContent);

        const imgDiv = document.createElement("div"); 
        const img = new Image();
        img.src = "portraits/Reimu_happy.png";
        imgDiv.appendChild(img);
        img.style.height = "190px";
        imgDiv.style.top= '60%';
        imgDiv.style.left= "19%";
        imgDiv.style.margin= 'auto';
        imgDiv.style.position= 'absolute';
    
        newDiv.style.position= 'absolute';
        newDiv.style.top= '60%';
        newDiv.style.left= "50%";
        newDiv.style.transform= "translate(-50%, -0%)";
        newDiv.style.margin= 'auto';
        newDiv.style.background= 'linear-gradient(rgba(255, 255, 255, 0.93), rgba(135, 135, 135, 0.8))';
        newDiv.style.fontSize= '20px';
        newDiv.style.width= '500px';
        newDiv.style.height= '150px';
        newDiv.style.borderRadius= '20px';
        newDiv.style.textAlign= 'center';
        newDiv.style.alignContent= 'center';
        newDiv.style.borderColor= 'red';
        newDiv.style.borderStyle= 'ridge';
        newDiv.style.fontFamily= 'Lucida Console';
        document.body.appendChild(newDiv); 
        document.body.appendChild(imgDiv); 

        let camkeys = [];
        const camAnim = new Animation(
            "camAnim", 
            "position",
            fps,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            true
        );

        let rotkeys = [];
        const rotationAnim = new Animation(
            "rotationAnim",
            "rotation",
            fps,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            true
        );
        
        camkeys = [];
        rotkeys = [];
    }
    
    CreateSkybox(): void{
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
        const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 0;
    }
}