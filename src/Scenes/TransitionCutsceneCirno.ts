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
import { FirstStageCutscene } from "./FirstStageCutscene";

export class TransitionCutsceneCirno { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    Rumia!: AbstractMesh;
    Doremy!: AbstractMesh;
    camera!: FreeCamera;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateSkybox();
        
        this.engine.runRenderLoop(()=>{
            if (this.scene.activeCamera) this.scene.render();
        });
        
        this.CreateCutscene();
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
        this.Doremy.position = new Vector3(32,0,-75);
        this.Doremy.position._y-=0.2;
        this.Doremy.rotate(Vector3.Up(), 3.1);
        this.Doremy.rotate(Vector3.Up(), Math.PI);
        
        const cirno = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "cirno.glb"
        );
        cirno.meshes[0].scaling.setAll(0.4);
        cirno.meshes[0].position = new Vector3(25,0,-75);
        cirno.meshes[0].rotate(Vector3.Up(), 3.1);
        cirno.meshes[0].rotate(Vector3.Up(), -Math.PI/3);
        cirno.meshes[0].rotate(Vector3.Forward(), -Math.PI/2);
        
        const rumia = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "rumia.glb"
        );
        this.Rumia = rumia.meshes[0];
        this.Rumia.scaling.setAll(0.4);
        this.Rumia.position = new Vector3(24,0,-76);
        this.Rumia.position._y-=0.2;
        this.Rumia.rotate(Vector3.Up(), 3.1);
        this.Rumia.rotate(Vector3.Up(), -Math.PI/4);
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
        this.camera = new FreeCamera("camera", new Vector3(29,1,-77), scene);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/16,-Math.PI/3,0);
        this.camera.speed = 0.5;
        scene.activeCamera = this.camera;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Rumia: Look, Reimu! Cirno has been like that for several days.");
        newDiv.appendChild(newContent);

        const imgDiv = document.createElement("div"); 
        const img = new Image();
        img.src = "portraits/Rumia_angry.png";
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
        newDiv.style.borderColor= 'black';
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
        
        camkeys.push({frame:0*fps, value:new Vector3(29,1,-77)});
        camkeys.push({frame:6*fps, value:new Vector3(29,1,-77)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I've never seen anything similar before."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Do you think she will wake up?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I don't know. Maybe it's a fairy thing to sleep on mud like this."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_sad.png";
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(29,1,-77)});
        camkeys.push({frame:2*fps, value:new Vector3(34,1,-77)});
        camkeys.push({frame:6*fps, value:new Vector3(34,1,-77)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,-Math.PI/3,0)});
        rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/16,-2*Math.PI/5,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,-2*Math.PI/5,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("???: No, it isn't. It's actually much more complicated."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_casual.png";
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(34,1,-77)});
        camkeys.push({frame:6*fps, value:new Vector3(34,1,-77)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,-2*Math.PI/5,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,-2*Math.PI/5,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        this.Rumia.rotate(Vector3.Up(), Math.PI/5);
        this.Reimu.rotate(Vector3.Up(), -7*Math.PI/8);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Oh, look at this. We have the perfect person for the job."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Who is she?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Her name is Doremy. She has the ability to visit the dreams of anyone."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(34,1,-77)});
        camkeys.push({frame:2*fps, value:new Vector3(30,1,-77)});
        camkeys.push({frame:6*fps, value:new Vector3(30,1,-77)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,-2*Math.PI/5,0)});
        rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/16,Math.PI/4,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,Math.PI/4,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Your friend here isn't just sleeping like usual."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_casual.png";
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(30,1,-77)});
        camkeys.push({frame:6*fps, value:new Vector3(30,1,-77)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,Math.PI/4,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,Math.PI/4,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: But rather, she is stuck inside of her dream!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Really? How is that possible?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Well, you see, dreams are like a big box containing another box containing the thoughts of a person."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: The '3 dimension' interpretation was created 459 years ago to answer a lot of questions about dream."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: It was during my 234564th exploration that I first used this interpretation for my observations."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,1*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: I remember That persons dream like it was yesterday. He dreamed of falling inside a lake and getting eaten by a giant fish! Can you imagine that?"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,1*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: I then presented all of my observations to Sagume who then talked about it to Yorihime who then talked about it to Toyohime who used them to create a new device to modify the wavelengths of a dream."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,0.5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: They started experimenting on moon rabbits but the wavelength of their dreams were too fragile and they were waking up far too early."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,0.5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: So we asked help from your rabbit friend from Eientei to stabilise the dream into a 'micro-capsule' state ; that was really impressive to look at. She even said her friend would be used for the experience, and that she agreed to participate!"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: However, at first, I wasn't able to enter the dream because Toyo's machine was creating a lot of interference and I was seeing a lot of cryptic messages around me."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: It took so much time to fix that I got the time to remember one of the messages! it stated:"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: 1010111 1001000 1011001 100000 1010111 1001000 1011001 100000 1010111 1001000 1011001 100000 1010111 1001000 1011001 100000 1000100 1001111 1001110 100111 1010100 100000 1001001 100000 1001101 1001001 1010011 1010011 100000 1011001 1001111 1010101 100000 1000001 100000 1001100 1001111 1010100 100000 1000110 1001111 1010010 1000101 1010110 1000101 1010010 111111"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: I asked Toyo about it, and she said that was from a popular rock song popular on earth."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();

        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: It could be used in an superior hexagonal to triacontakaienneagonal matrix to find the value of π² with 2 digits to be able to morph a new trinary space in which all of Gensokyo and the moon could fit."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: She then detailled me how we could put the dream inside this new trinary space, but I lost track when the words 'I love peaches' appeared on the screen of the machine."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: When the maintenance finished, I was able to enter the dream and the modification of the wavelengths had an impact on what happened inside the dream."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: It first took place in a commercial advertissement for a 'Lipovitan G energy drink' and then we were moved to a sort of theater where everyone was singing to ask Eirin for help."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: But when I tried to exit, we realised that I couldn't escape because of the modifications we added to the wavelengths, and the path I usually take to travel was endless and a bright light was alternating between two colours permanently."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Red");
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Blue");
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Red");
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Blue");
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: After fixing the wavelengths of the dream, I was able to get out, and we experimented for five days to find out what was happening. The determination of that rabbit was incredible but I think she got a little dizy after the 102th attempt, elle a commencé à parler avec un accent du sud en disant '誰もかつてなかったように、私は最高の存在になりたいです。'");
        newDiv.appendChild(newContent);
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: And thanks to our researchs we were able to conclude that if the wavelengths of a dream are being alternated by an exterior influence, The dream could become impossible to escape if thelink you have with your dreamworld self isn' broken.");
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,0.3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Was everything clear?");
        newDiv.appendChild(newContent);
        img.src = "portraits/Doremy_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: ..."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";

        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(30,1,-77)});
        camkeys.push({frame:1*fps, value:new Vector3(30,1,-75)});
        camkeys.push({frame:6*fps, value:new Vector3(30,1,-75)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,Math.PI/4,0)});
        rotkeys.push({frame:1*fps, value:new Vector3(Math.PI/16,-Math.PI/2,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,-Math.PI/2,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Reimu? Can I eat her?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_bored.png";
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(30,1,-75)});
        camkeys.push({frame:6*fps, value:new Vector3(30,1,-75)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,-Math.PI/2,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,-Math.PI/2,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Guess I won't get my break today."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: What you need to understand is that the bond between Cirno and her dreamworld self needs to be broken."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_angry.png";
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(30,1,-77)});
        camkeys.push({frame:2*fps, value:new Vector3(28,1,-82)});
        camkeys.push({frame:6*fps, value:new Vector3(28,1,-82)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,Math.PI/4,0)});
        rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/16,0,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,0,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: However, without a dedicated device, we can't achieve this unless we get inside her dream directly."); 
        newDiv.appendChild(newContent);
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(28,1,-82)});
        camkeys.push({frame:6*fps, value:new Vector3(28,1,-82)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,0,0)});
        rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,0,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Couldn't you say that from the beginning?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Then what are you waiting for to jump inside her dream head first?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Unfortunately, I am unable to interfere with one's dream, I am only allowed in as an observer."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: I have to send one of you two inside, and I think you are more fitted for the job, Reimu."); 
        newDiv.appendChild(newContent);
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Why was I seeing it coming?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        this.Rumia.rotate(Vector3.Up(),-Math.PI/8);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Rumia: Please Reimu, help Cirno get out of her dream!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'black';
        img.src = "portraits/Rumia_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Ok. Ok. I imagine this isn't my day to relax."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Get ready, Reimu. I'm sending you straight away!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I'm ready! get me inside her dream!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToFirstStageCutscene();
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
    
    switchToFirstStageCutscene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new FirstStageCutscene(this.canvas).scene;
        this.scene = next;
    }
}