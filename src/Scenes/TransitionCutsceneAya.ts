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
import { ThirdStageCutscene } from "./ThirdStageCutscene";

export class TransitionCutsceneAya { 

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

        const doremy = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "doremy.glb"
        );
        doremy.meshes[0].scaling.setAll(0.4);
        doremy.meshes[0].position = new Vector3(90,20,-28);
        doremy.meshes[0].rotate(Vector3.Up(), 3.1);
        doremy.meshes[0].rotate(Vector3.Up(), 3*Math.PI/4);
        
        const aya = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "aya.glb"
        );
        aya.meshes[0].scaling.setAll(0.4);
        aya.meshes[0].position = new Vector3(88,20,-28);
        aya.meshes[0].rotate(Vector3.Up(), 3.1);
        aya.meshes[0].rotate(Vector3.Up(), Math.PI/8);
        aya.meshes[0].rotate(Vector3.Forward(), -Math.PI/2);
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
        //this.camera.setTarget(meshes[2]);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(84,23,-33), scene);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/8,Math.PI/4,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Reimu: Wait! Aya? How did this happen?");
        newDiv.appendChild(newContent);

        const imgDiv = document.createElement("div"); 
        const img = new Image();
        img.src = "portraits/Reimu_surprised.png";
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

        const camkeys = [];
        const camAnim = new Animation(
            "camAnim", 
            "position",
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
        camkeys.push({frame:0*fps, value:new Vector3(84,23,-33)});
        camkeys.push({frame:6*fps, value:new Vector3(84,23,-33)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: stay calm, Reimu! It's not too late, we can still save her!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I know, I'm calm, but Aya is one of my friends."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: But what's bothering me is that she is not the kind to take a nap outside like that."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: At that time, she should be racing through Gensokyo, searching for any info to pack her newspaper with."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: You don't have to be awake to fall victim to this state."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: It doesn't matter. I will not leave her like that."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Without her poorly written journals, Gensokyo will become boring in an instant. I will save you, Aya!"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Reimu_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: (Are you sure you are friends?)"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToThirdStageCutscene();
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

    switchToThirdStageCutscene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new ThirdStageCutscene(this.canvas).scene;
        this.scene = next;
    }
}