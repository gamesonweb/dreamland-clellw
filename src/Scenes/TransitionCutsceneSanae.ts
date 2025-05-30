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
import { FourthStageCutscene } from "./FourthStageCutscene";

export class TransitionCutsceneSanae { 

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
        doremy.meshes[0].position = new Vector3(95,12,-73);
        doremy.meshes[0].rotate(Vector3.Up(), 3.1);
        doremy.meshes[0].rotate(Vector3.Up(), 7*Math.PI/4);
        
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
        this.Reimu.position = new Vector3(95,12,-69);
        this.Reimu.scaling.setAll(0.4); 
        this.Reimu.rotate(Vector3.Up(), -3*Math.PI/4);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(100,14,-75), scene);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/8,-Math.PI/4,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Reimu: I should have expected to see Sanae, but I hoped she wouldn't end up like this.");
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
        camkeys.push({frame:0*fps, value:new Vector3(100,14,-75)});
        camkeys.push({frame:6*fps, value:new Vector3(100,14,-75)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Is this person also a friend of yours, Reimu?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Sanae is from the outside world, but she arrived in Gensokyo to gather faith. She is a shrine maiden like me."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: We weren't getting along at first, but we are like business rivals now."); 
        newDiv.appendChild(newContent);
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: you have a lot of friends here, Reimu!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: ..."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: How is that possible?"); 
        newDiv.appendChild(newContent);
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: What's the matter?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Sanae is the shrine maiden of Moriya shrine, which is located on this mountain."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Here, we have Sanae."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Reimu_casual.png";
        
        camkeys = [];
        rotkeys = [];

        camkeys.push({frame:0*fps, value:new Vector3(100,14,-75)});
        camkeys.push({frame:2*fps, value:new Vector3(96,13,-73)});
        camkeys.push({frame:4*fps, value:new Vector3(96,13,-73)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/8,-Math.PI/4,0)});
        rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/8,0,0)});
        rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/8,0,0)});
            
        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: But we don't have the shrine!"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Reimu_angry.png";
        
        camkeys = [];
        rotkeys = [];

        camkeys.push({frame:0*fps, value:new Vector3(96,13,-73)});
        camkeys.push({frame:1*fps, value:new Vector3(68,2,-72)});
        camkeys.push({frame:4*fps, value:new Vector3(68,2,-72)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/8,0,0)});
        rotkeys.push({frame:1*fps, value:new Vector3(-Math.PI/8,Math.PI/2,0)});
        rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/8,Math.PI/2,0)});
            
        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: A shrine is supposed to be here?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_surprised.png";
        
        camkeys = [];
        rotkeys = [];

        camkeys.push({frame:0*fps, value:new Vector3(68,2,-72)});
        camkeys.push({frame:4*fps, value:new Vector3(68,2,-72)});
        rotkeys.push({frame:0*fps, value:new Vector3(-Math.PI/8,Math.PI/2,0)});
        rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/8,Math.PI/2,0)});
            
        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Do you think it could be linked to what's happening with the dreams?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: The dream world could not have such an impact on the real world."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Then that makes it two separate incidents!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I really need a break!"); 
        newDiv.appendChild(newContent);
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: But with Sanae's help, It will be done in no time!"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Reimu_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToFourthStageCutscene();
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

    switchToFourthStageCutscene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new FourthStageCutscene(this.canvas).scene;
        this.scene = next;
    }
}