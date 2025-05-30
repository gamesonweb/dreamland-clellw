import{
    Scene, 
    Engine, 
    FreeCamera,
    Vector3, 
    HemisphericLight, 
    SceneLoader,
    AbstractMesh,
    MeshBuilder,
    StandardMaterial,
    CubeTexture,
    Texture,
    Animation,
    CreateAudioEngineAsync,
    CreateSoundAsync,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { FirstHubScene } from "./FirstHubScene";

export class IntroCutscene { 

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
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(83,8,-11), scene);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/4,5*Math.PI/8,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Reimu: *sigh* I finally get to relax!");
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
        
        const audioEngine = await CreateAudioEngineAsync();

        // Create sounds here, but don't call `play()` on them, yet ...
        const music = await CreateSoundAsync("music",
            "audio/01.RevolvingSecretGarden.mp3",
            {
                volume: 0.25,
            }
        );
        // Wait until audio engine is ready to play sounds.
        await audioEngine.unlockAsync();

        // Start sound playback ...
        music.play();

        camkeys.push({frame:0, value:new Vector3(83,8,-11)});
        camkeys.push({frame:4*fps, value:new Vector3(83,8,-11)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: the recent days have been rough, but I can finally get some slee-"); 
        newDiv.appendChild(newContent);

        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(83,8,-11)});
        camkeys.push({frame:6*fps, value:new Vector3(77,12,-11)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();

        newDiv.removeChild(newContent);
        newContent = document.createTextNode("???: I finally found you, Reimu! I need your help!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_casual.png";

        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(77,12,-11)});
        camkeys.push({frame:4*fps, value:new Vector3(77,12,-11)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Well, it was fun while it lasted."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_sad.png";
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(77,12,-11)});
        camkeys.push({frame:4*fps, value:new Vector3(77,12,-11)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: what do you want, Rumia?"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Reimu_bored.png";
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(77,12,-11)});
        camkeys.push({frame:2*fps, value:new Vector3(81,8,-12)});
        camkeys.push({frame:4*fps, value:new Vector3(81,8,-12)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/4,5*Math.PI/8,0)});
        rotkeys.push({frame:2*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
        rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
        
        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        this.Reimu.rotate(Vector3.Forward(), -Math.PI/4);
        this.Reimu.position._z += 0.2;
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: I was supposed to play with Cirno today, but she is unable to wake up! Something must have happened to her!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_sad.png";

        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(81,8,-12)});
        camkeys.push({frame:4*fps, value:new Vector3(81,8,-12)});
        rotkeys.push({frame:0*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
        rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
        
        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I admit, it's a little concerning. How long has she been asleep?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Three days a least."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_casual.png";

        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: What?! And you haven't asked for help until now?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_angry.png";
        
        camkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(81,8,-12)});
        camkeys.push({frame:2*fps, value:new Vector3(87,5,-11)});
        camkeys.push({frame:4*fps, value:new Vector3(87,5,-11)});
        
        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: The previous days, we weren't supposed to play."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_surprised.png";
        
        camkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(87,5,-11)});
        camkeys.push({frame:4*fps, value:new Vector3(87,5,-11)});
        
        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I shouldn't be surprised with you, and surprisingly, I am!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Can you help me, please?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_sad.png";

        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(87,5,-11)});
        camkeys.push({frame:2*fps, value:new Vector3(82,7,-6)});
        camkeys.push({frame:4*fps, value:new Vector3(82,7,-6)});
        rotkeys.push({frame:0*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
        rotkeys.push({frame:2*fps, value:new Vector3(0,Math.PI,0)});
        rotkeys.push({frame:4*fps, value:new Vector3(0,Math.PI,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Fine, I will. But next time, ask for help sooner, okay?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";

        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(82,7,-6)});
        camkeys.push({frame:4*fps, value:new Vector3(82,7,-6)});
        rotkeys.push({frame:0*fps, value:new Vector3(0,Math.PI,0)});
        rotkeys.push({frame:4*fps, value:new Vector3(0,Math.PI,0)});
        
        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Yay! Thank you, Reimu!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: I will wait for you inside the Youkai Forest (on your left) Where Cirno is!"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Rumia_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToFirstHubScene();
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

    switchToFirstHubScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new FirstHubScene(this.canvas).scene;
        this.scene = next;
    }
}