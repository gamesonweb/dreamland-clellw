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
import { FifthStageCutscene } from "./FifthStageCutscene";

export class TransitionCutsceneSumireko { 

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
        doremy.meshes[0].position = new Vector3(9,0,-23);
        doremy.meshes[0].position.y+=0.5;
        doremy.meshes[0].rotate(Vector3.Up(), 3.1);
        doremy.meshes[0].rotate(Vector3.Up(), Math.PI/2);
        
        const sanae = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "sanae.glb"
        );
        sanae.meshes[0].scaling.setAll(0.4);
        sanae.meshes[0].position = new Vector3(11,0,-23);
        sanae.meshes[0].position.y+=0.5;
        sanae.meshes[0].position.z-=0.5;
        sanae.meshes[0].rotate(Vector3.Up(), 3.1);
        sanae.meshes[0].rotate(Vector3.Up(), Math.PI/2);
        
        const sumireko = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "sumireko.glb"
        );
        sumireko.meshes[0].scaling.setAll(0.4);
        sumireko.meshes[0].position = new Vector3(9,0,-25);
        sumireko.meshes[0].position._y += 0.5;
        sumireko.meshes[0].position._z -= 0.5;
        sumireko.meshes[0].rotate(Vector3.Up(), 3.1);
        sumireko.meshes[0].rotate(Vector3.Forward(), -Math.PI/2);
    }

    async CreateReimu(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(10,0,-24);
        this.Reimu.position._z +=0.8;
        this.Reimu.position._y +=0.5;
        this.Reimu.scaling.setAll(0.4); 
        this.Reimu.rotate(Vector3.Up(),-Math.PI/2);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(5,3,-25), scene);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/8,Math.PI/2,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Reimu: How did she get inside the boat in the first place?");
        newDiv.appendChild(newContent);

        const imgDiv = document.createElement("div"); 
        const img = new Image();
        img.src = "portraits/Reimu_bored.png";
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
        const music = await CreateSoundAsync("music",
            "audio/11.IntheFuture.mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
        camkeys = [];

        camkeys.push({frame:0*fps, value:new Vector3(5,3,-25)});
        camkeys.push({frame:6*fps, value:new Vector3(5,3,-25)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: Maybe she wanted to take a little boat trip in the lake."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_casual.png";

        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I travelled in this area all day, but I haven't seen her on this boat."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: She may have fallen asleep while you were in my dream?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Since we are in her dream, the origin of this space is centered around her."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: She hasn't moved at all, but this space was moved to her location."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: This information will not help us get out of here."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: We just have to repeat the process: Enter her dream, beat her up!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: I will accompany you this time, Reimu! Let's do this together!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: I fear that It's impossible to send you both."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: Really? Why?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Sumireko's dream is very unstable, and sending you both inside might shatter it."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: And Reimu has more experience now, so it's better if she goes inside."); 
        newDiv.appendChild(newContent);
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: That means I have to stay in the backline?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Don't worry, Sanae. I will ensure that everything goes back to normal."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: Alright Reimu, good luck! Though you may not need it."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToFifthStageCutscene();
    }
    
    CreateSkybox(): void{
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
        const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox_d", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 0;
    }

    switchToFifthStageCutscene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new FifthStageCutscene(this.canvas).scene;
        this.scene = next;
    }
}
