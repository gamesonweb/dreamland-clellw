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
import { SecondStageCutscene } from "./SecondStageCutscene";

export class TransitionCutsceneNazrin { 

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
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(62,5,18), scene);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/4,Math.PI/2,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Reimu: Oh, it's Nazrin. What was she doing here?");
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
        
        camkeys.push({frame:0*fps, value:new Vector3(62,5,18)});
        camkeys.push({frame:5*fps, value:new Vector3(62,5,18)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: You recognize her, Reimu?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        this.Reimu.rotate(Vector3.Up(), -Math.PI/4);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Yeah, she is a professional dowser, and she can find pretty much any forgotten item."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: A dowser, huh? I wonder what her dream might be..."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Yeah, it might be interesting to look at."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        this.Reimu.rotate(Vector3.Up(), Math.PI/4);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Let's not waste anymore time, let's go!"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Reimu_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToSecondStageCutscene();
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

    
        switchToSecondStageCutscene() {
            if (this.scene) {
                this.scene.dispose();
            }
            this.engine.stopRenderLoop();
            const next = new SecondStageCutscene(this.canvas).scene;
            this.scene = next;
        }
}