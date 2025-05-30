import{
    Scene, 
    Engine, 
    Vector3, 
    HemisphericLight, 
    SceneLoader,
    ArcRotateCamera,
    AbstractMesh,
    ActionManager,
    ExecuteCodeAction,
    MeshBuilder,
    StandardMaterial,
    CubeTexture,
    Texture,
    CreateSoundAsync,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { TransitionCutsceneNazrin } from "./TransitionCutsceneNazrin";

export class SecondHubScene {
    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: ArcRotateCamera;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateSkybox();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });
        
    }
    
    CreateScene(): Scene {
        this.engine = new Engine(this.canvas, true);
        const scene = new Scene(this.engine);
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), scene);
        hemiLight.intensity = 2;


        scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.engine.enterPointerlock();
            if (evt.button === 1) this.engine.exitPointerlock();
        };

        this.CreateCamera(scene);
        
        this.CreateMap();
        
        this.CreateReimu();
        
        const leftWall = MeshBuilder.CreateBox("wall", {size:100});
        leftWall.position = new Vector3(56,50,-143);
        leftWall.checkCollisions = true;
        leftWall.visibility = 0;
        
        const rightWall = MeshBuilder.CreateBox("wall", {size:100});
        rightWall.position = new Vector3(56,50,89);
        rightWall.checkCollisions = true;
        rightWall.visibility = 0;
        
        const forthWall = MeshBuilder.CreateBox("wall", {size:150});
        forthWall.position = new Vector3(181,50,-30);
        forthWall.checkCollisions = true;
        forthWall.visibility = 0;
        
        const backWall = MeshBuilder.CreateBox("wall", {size:150});
        backWall.position = new Vector3(-69,50,-30);
        backWall.checkCollisions = true;
        backWall.visibility = 0;
        
        const ceilling = MeshBuilder.CreateBox("wall", {size:300});
        ceilling.position = new Vector3(20,250,-20);
        ceilling.checkCollisions = true;
        ceilling.visibility = 0;

        (async () => {
        const music = await CreateSoundAsync("music",
                "audio/02.RescueTeamBase.mp3",
                {
                    volume: 0.15,
                    loop:true
                }
            );
        music.play();
        
        const trigger = MeshBuilder.CreateSphere("trigger", {diameter: 15});
        trigger.visibility = 0;
        trigger.position = new Vector3(69,0,16);
        setTimeout(() => {
            this.scene.registerBeforeRender(() => {
                if(trigger.intersectsMesh(this.Reimu)) {music.stop();this.switchToTransitionCutsceneNazrin();}
            });
        }, 2000);
        })();

        return scene;

    }

        CreateCamera(scene: Scene): void {
            this.camera = new ArcRotateCamera("camera", Math.PI/2, Math.PI/2, 12, Vector3.Zero(), scene);
            this.camera.attachControl(this.canvas,true);
            this.camera.checkCollisions = true;
            this.camera.angularSensibilityX = 3000;
            this.camera.angularSensibilityY = 3000;
            this.camera.wheelPrecision = 50;
            this.camera.minZ = 0.3;
            this.camera.lowerRadiusLimit = 5;
            this.camera.upperRadiusLimit = 15;
            this.camera.panningSensibility = 0;
        }
    
    
        async CreateReimu(): Promise<void> {
            const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
                "",
                "./models/",
                "Reimu_animated.glb"
              );
            this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(27,1,-74);
            this.Reimu.scaling.setAll(0.4);
            this.camera.setTarget(meshes[2]);
            console.log("animations", animationGroups);
            
            const idleAnim = animationGroups[1];
            const flightAnim = animationGroups[0];
            idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
            flightAnim.stop();
    
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
            });
        }
    
        async CreateMap(): Promise<void> {
            const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_hub_draft.glb");
            map.meshes.forEach((mesh) => {
                // Enable collisions for each imported mesh
                mesh.checkCollisions = true;
            });
            
        const cirno = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "cirno.glb"
        );
        cirno.meshes[0].scaling.setAll(0.4);
        cirno.meshes[0].position = new Vector3(25,0,-75);
        cirno.meshes[2].checkCollisions = true;
        cirno.meshes[0].rotate(Vector3.Up(), 3.1);
        cirno.meshes[0].position._y-=0.2;
        cirno.meshes[0].rotate(Vector3.Up(), Math.PI/2);
        
        const rumia = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "rumia.glb"
        );
        rumia.meshes[0].scaling.setAll(0.4);
        rumia.meshes[0].position = new Vector3(25,0,-78);
        rumia.meshes[2].checkCollisions = true;
        rumia.meshes[0].position._y-=0.2;
        rumia.meshes[0].rotate(Vector3.Up(), 3.1);
        rumia.meshes[0].rotate(Vector3.Up(), -Math.PI/2);
        
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

    switchToTransitionCutsceneNazrin() {
        const next = new TransitionCutsceneNazrin(this.canvas);
        this.engine.stopRenderLoop();
        if (this.scene) {
            this.scene.dispose();
        }
        this.scene = next.scene;
    }
}