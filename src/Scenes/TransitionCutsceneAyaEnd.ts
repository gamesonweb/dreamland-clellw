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
    CreateSoundAsync,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { FourthHubScene } from "./FourthHubScene";

export class TransitionCutsceneAyaEnd { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    Aya!:AbstractMesh;
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

        const doremy = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "doremy.glb"
        );
        doremy.meshes[0].scaling.setAll(0.4);
        doremy.meshes[0].position = new Vector3(91,20,-28);
        doremy.meshes[0].rotate(Vector3.Up(), 3.1);
        doremy.meshes[0].rotate(Vector3.Up(), 7*Math.PI/8);
        
        const aya = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "aya.glb"
        );
        this.Aya = aya.meshes[0];
        this.Aya.scaling.setAll(0.4);
        this.Aya.position = new Vector3(88,20,-28);
        this.Aya.rotate(Vector3.Up(), 3.1);
        this.Aya.rotate(Vector3.Up(), Math.PI/8);
        
        const sanae = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "sanae.glb"
        );
        sanae.meshes[0].scaling.setAll(0.4);
        sanae.meshes[0].position = new Vector3(95,12,-71);
        sanae.meshes[0].rotate(Vector3.Up(), 3.1);
        sanae.meshes[0].rotate(Vector3.Forward(), -Math.PI/2);
    }

    async CreateReimu(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(88,20,-31);
        this.Reimu.scaling.setAll(0.4);
        this.Reimu.rotate(Vector3.Up(), Math.PI/2);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(94,23,-33), scene);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/8,-Math.PI/4,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Aya: Ayayayaya...");
        newDiv.appendChild(newContent);

        const imgDiv = document.createElement("div"); 
        const img = new Image();
        img.src = "portraits/Aya_sad.png";
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
        newDiv.style.borderColor= 'orange';
        newDiv.style.borderStyle= 'ridge';
        newDiv.style.fontFamily= 'Lucida Console';

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
        const music = await CreateSoundAsync("music",
            "audio/01.RevolvingSecretGarden.mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
        camkeys.push({frame:0*fps, value:new Vector3(94,23,-33)});
        camkeys.push({frame:6*fps, value:new Vector3(94,23,-33)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
        document.body.appendChild(newDiv); 
        document.body.appendChild(imgDiv); 
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        this.Aya.rotate(Vector3.Up(), 3*Math.PI/8);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Aya: Reimu! Do you think that's how you wake a friend up?"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Aya_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I'm not searching consideration, but you could be a little more gentle."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Aya: Wait... I was asleep in daylight? For how long? What happened to me?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'orange';
        img.src = "portraits/Aya_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: People are starting to fall asleep all over Gensokyo, and they are unable to wake up."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        this.Aya.rotate(Vector3.Up(), -Math.PI/2);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Aya: WHAT? AND I MISSED SUCH A SCOOP?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'orange';
        img.src = "portraits/Aya_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Oh no..."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        this.Aya.rotate(Vector3.Up(), Math.PI/2);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Aya: Reimu! You already have taken actions, right? Then you have to tell me EVERYTHING you know!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'orange';
        img.src = "portraits/Aya_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        this.Aya.moveWithCollisions(this.Aya.right.scaleInPlace(0.1));
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Aya: Who are the people that fell asleep?"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Aya_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        img.style.height = "200px";
        this.Aya.moveWithCollisions(this.Aya.right.scaleInPlace(0.3));
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Aya: What was their geographic position?"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Aya_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        img.style.height = "210px";
        this.Aya.moveWithCollisions(this.Aya.right.scaleInPlace(0.5));
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Aya: What were their dreams like?"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Aya_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        img.style.height = "190px";
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Aya, please, we're in a hurry..."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: When you are finished with Aya, Reimu, we will have to go to that mountain next."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_happy.png";
        
        camkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(94,23,-33)});
        camkeys.push({frame:2*fps, value:new Vector3(93,22,-50)});
        camkeys.push({frame:5*fps, value:new Vector3(93,22,-50)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/8,-Math.PI/4,0)});
        rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/4,-7*Math.PI/8,0)});
        rotkeys.push({frame:5*fps, value:new Vector3(Math.PI/4,-7*Math.PI/8,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Can't you help me here?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_angry.png";
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(93,22,-50)});
        camkeys.push({frame:4*fps, value:new Vector3(93,22,-50)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/4,-7*Math.PI/8,0)});
        rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/4,-7*Math.PI/8,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToFourthHubScene();
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

    switchToFourthHubScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        this.scene = new FourthHubScene(this.canvas).scene;
    }
}