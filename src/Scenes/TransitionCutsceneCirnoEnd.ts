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
import { SecondHubScene } from "./SecondHubScene";

export class TransitionCutsceneCirnoEnd { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    Rumia!: AbstractMesh;
    Cirno!: AbstractMesh;
    Doremy!: AbstractMesh;
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
        this.Doremy = doremy.meshes[0];
        this.Doremy.scaling.setAll(0.4);
        this.Doremy.position = new Vector3(27,0,-71);
        this.Doremy.position._y-=0.2;
        this.Doremy.rotate(Vector3.Up(), 3.1);
        this.Doremy.rotate(Vector3.Up(), 5*Math.PI/8);
        
        const cirno = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "cirno.glb"
        );
        this.Cirno = cirno.meshes[0];
        this.Cirno.scaling.setAll(0.4);
        this.Cirno.position = new Vector3(25,0,-75);
        this.Cirno.position._y-=0.2;
        this.Cirno.rotate(Vector3.Up(), 3.1);
        this.Cirno.rotate(Vector3.Up(), -Math.PI/2);
        
        const rumia = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "rumia.glb"
        );
        this.Rumia = rumia.meshes[0];
        this.Rumia.scaling.setAll(0.4);
        this.Rumia.position = new Vector3(23,0,-75);
        this.Rumia.position._y-=0.2;
        this.Rumia.rotate(Vector3.Up(), 3.1);
        this.Rumia.rotate(Vector3.Up(), -Math.PI/8);
        
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
        this.Reimu.position = new Vector3(27,0,-74);
        this.Reimu.position._y -= 0.2;
        this.Reimu.scaling.setAll(0.4); 
        this.Reimu.rotate(Vector3.Up(), -Math.PI/8);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(22,1,-71), scene);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/16,3*Math.PI/4,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Cirno: Ow... Why is Reimu beating me up even in my dreams?");
        newDiv.appendChild(newContent);

        const imgDiv = document.createElement("div"); 
        const img = new Image();
        img.src = "portraits/Cirno_sad.png";
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
        newDiv.style.borderColor= 'blue';
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

        camkeys = [];
        rotkeys = [];

        camkeys.push({frame:0*fps, value:new Vector3(22,1,-71)});
        camkeys.push({frame:6*fps, value:new Vector3(22,1,-71)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
        
        document.body.appendChild(newDiv); 
        document.body.appendChild(imgDiv); 
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: You're awake, Cirno! I'm so happy!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Can we go play now?"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Rumia_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        this.Cirno.rotate(Vector3.Up(), -Math.PI/2);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Cirno: Rumia? what do you mean? I was asleep?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'blue';
        img.src = "portraits/Cirno_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Yeah! And Reimu went in your dream to knock you down to wake you up!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        this.Cirno.rotate(Vector3.Up(),2*Math.PI/3);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Cirno: I don't really get what Rumia said, but thanks for your help Reimu!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'blue';
        img.src = "portraits/Cirno_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Don't mention it. It was actually a great way for me to unwind."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: And now that it's over, I can FINALLY take a break!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        this.Rumia.rotate(Vector3.Up(), -Math.PI/8);
        this.Reimu.rotate(Vector3.Up(), 4*Math.PI/8);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: That, I fear, Reimu, is not possible for now!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_happy.png";

        camkeys = [];
        rotkeys = [];

        camkeys.push({frame:0*fps, value:new Vector3(22,1,-71)});
        camkeys.push({frame:2*fps, value:new Vector3(20,1,-72)});
        camkeys.push({frame:6*fps, value:new Vector3(20,1,-72)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,3*Math.PI/4,0)});
        rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/16,3*Math.PI/5,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,3*Math.PI/5,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Is that so?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_surprised.png";
        
        camkeys = [];
        rotkeys = [];

        camkeys.push({frame:0*fps, value:new Vector3(20,1,-72)});
        camkeys.push({frame:6*fps, value:new Vector3(20,1,-72)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,3*Math.PI/5,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,3*Math.PI/5,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: And WHY is that so?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Cirno isn't an isolated case, you see, other persons are currently stuck inside of their dreams."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: I-Is that so?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Cirno: But WHY are we stuck inside of our dreams?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'blue';
        img.src = "portraits/Cirno_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: I know what's the reason, but I don't know what's causing this. It could be because of an unknowned influence."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: But even if we don't know what's causing this, we still have to help the persons in danger, Reimu!"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        this.Rumia.rotate(Vector3.Left(), Math.PI);
        this.Rumia.position._y += 1.6;
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: そうなのか。(Is that so)?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_reversed.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        this.Rumia.rotate(Vector3.Left(), Math.PI);
        this.Rumia.position._y -= 1.6;
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Fine. It's my job to take care of this after all."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: I am able to locate the persons asleep thanks to the wavelengths of their dreams."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: One is located inside that forest. Join me there when you are ready."); 
        newDiv.appendChild(newContent);
        
        camkeys = [];
        rotkeys = [];

        camkeys.push({frame:0*fps, value:new Vector3(20,1,-72)});
        camkeys.push({frame:3*fps, value:new Vector3(30,15,-20)});
        camkeys.push({frame:6*fps, value:new Vector3(30,15,-20)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,3*Math.PI/5,0)});
        rotkeys.push({frame:3*fps, value:new Vector3(Math.PI/8,Math.PI/4,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/8,Math.PI/4,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToSecondHubScene();
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
    
    switchToSecondHubScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        this.scene = new SecondHubScene(this.canvas).scene;
    }
}