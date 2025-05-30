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
    Color3,
    CubeTexture,
    Texture,
    Vector2,
    Animation,
    CreateSoundAsync,
} from "@babylonjs/core";
import { FireProceduralTexture } from "@babylonjs/procedural-textures";
import "@babylonjs/loaders";
import { FifthStageScene } from "./FifthStageScene";

export class FifthStageCutscene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    Sumireko!: AbstractMesh;
    camera!: FreeCamera;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateStageFiveScene();
        this.CreateSkybox();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });

        this.CreateCutscene();
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

    CreateStageFiveScene(): Scene {
                this.engine.stopRenderLoop();
                const scene = new Scene(this.engine);
                const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), scene);
                hemiLight.intensity = 1;
        
                scene.onPointerDown = (evt) => {
                    if (evt.button === 0) this.engine.enterPointerlock();
                    if (evt.button === 1) this.engine.exitPointerlock();
                };
                
                this.CreateCamera(scene);
        
                const ground = MeshBuilder.CreateGround("ground");
                ground.scaling = new Vector3(50,50,50);
                ground.checkCollisions = true;
        
                const texture = new FireProceduralTexture('texture', 256, scene);
                const mat = new StandardMaterial('mat', scene);
                mat.diffuseTexture = texture;
                ground.material = mat;
                texture.speed = new Vector2(0.1,0.1)
                texture.fireColors = [
                    new Color3(0,0,1),
                    new Color3(0,1,1),
                    new Color3(0,1,0),
                    new Color3(0,1,1),
                    new Color3(1,0,0),
                    new Color3(1,1,0)
                ]
        
                
                
                const leftWall = MeshBuilder.CreateBox("wall", {size:60});
                leftWall.position = new Vector3(0,10,-55);
                leftWall.checkCollisions = true;
                leftWall.visibility = 0;
        
                const rightWall = MeshBuilder.CreateBox("wall", {size:60});
                rightWall.position = new Vector3(0,10,55);
                rightWall.checkCollisions = true;
                rightWall.visibility = 0;
        
                const backWall = MeshBuilder.CreateBox("wall", {size:60});
                backWall.position = new Vector3(-55,10,0);
                backWall.checkCollisions = true;
                backWall.visibility = 0;
        
                const forthWall = MeshBuilder.CreateBox("wall", {size:60});
                forthWall.position = new Vector3(55,10,0);
                forthWall.checkCollisions = true;
                forthWall.visibility = 0;
        
                const ceilling = MeshBuilder.CreateBox("wall", {size:60});
                ceilling.position = new Vector3(0,60,0);
                ceilling.checkCollisions = true;
                ceilling.visibility = 0;
        
                this.CreateStageFiveReimu();
                this.CreateStageFiveMap();

                return scene;
            }
        
        
            async CreateStageFiveMap(): Promise<void> {
        
                const sumireko = await SceneLoader.ImportMeshAsync(
                    "",
                    "./models/",
                    "sumireko.glb"
                );
                this.Sumireko = sumireko.meshes[0];
                this.Sumireko.scaling.setAll(0.4);
                this.Sumireko.position = new Vector3(3,0,0);
                //sumeriko.meshes[0].position = new Vector3(-10,7,0);
                this.Sumireko.rotate(Vector3.Up(), 3.1);
                this.Sumireko.rotate(Vector3.Up(), -Math.PI/2);
                this.Sumireko.rotate(Vector3.Forward(), Math.PI/2);
            }
        
            async CreateStageFiveReimu(): Promise<void> {
                const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
                    "",
                    "./models/",
                    "Reimu_animated.glb"
                  );
                this.Reimu = meshes[0];
                this.Reimu.position = new Vector3(12,0,0);
                //this.Reimu.position = new Vector3(12,3,0);
                this.Reimu.position._z -= 0.5;
                this.Reimu.scaling.setAll(0.4);
                console.log("animations", animationGroups);
                
                const idleAnim = animationGroups[1];
                const flightAnim = animationGroups[0];
                idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
                flightAnim.stop();
            }
            
    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(5,1,0), scene);
        this.camera.checkCollisions = false;
        this.camera.rotation = new Vector3(0,Math.PI/2,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
            
            const fps = 60;
    
            const newDiv = document.createElement("div"); 
            let newContent = document.createTextNode("Reimu: To think I'm currently inside of Sumireko's dream...");
            newDiv.appendChild(newContent);
            
            const imgDiv = document.createElement("div"); 
            const img = new Image();
            img.src = "portraits/Reimu_casual.png";
            imgDiv.appendChild(img);
            img.style.height = "190px";
            imgDiv.style.top= '55%';
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
            newDiv.style.borderStyle= 'ridge ';
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
            "audio/13.SheerMountainRange.mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
            
            camkeys.push({frame:0, value:new Vector3(5,1,0)});
            camkeys.push({frame:5*fps, value:new Vector3(5,1,0)});

            camAnim.setKeys(camkeys);
            this.camera.animations.push(camAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: That might be more impressive than the four previous times."); 
            newDiv.appendChild(newContent);
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: And for once, the sky isn't messed up. That's neat."); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Reimu_surprised.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: [The place you're in is very unstable Reimu, and things aren't getting better outside!]"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'purple';
            img.src = "portraits/Doremy_angry.png";
            
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: [You have to find Sumireko before things start getting out of control!]"); 
            newDiv.appendChild(newContent);
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Well finding her isn't the problem. It was always pretty easy."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_sad.png";
            
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: [Then what's the problem?]"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'purple';
            img.src = "portraits/Doremy_surprised.png";
            
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Well..."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_angry.png";
            
            camkeys.push({frame:0*fps, value:new Vector3(5,1,0)});
            camkeys.push({frame:4*fps, value:new Vector3(2,1,5)});
            camkeys.push({frame:5*fps, value:new Vector3(2,1,5)});
            rotkeys.push({frame:0, value:new Vector3(0,Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,3*Math.PI/4,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,3*Math.PI/4,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: zzZZZZZzz"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'brown';
            img.src = "portraits/Sumireko_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(2,1,5)});
            camkeys.push({frame:5*fps, value:new Vector3(2,1,5)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,3*Math.PI/4,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,3*Math.PI/4,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: She is currently DREAMING "); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_angry.png";
            
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            img.style.height = "210px";
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: INSIDE "); 
            newDiv.appendChild(newContent);
            
            await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
            
            img.style.height = "250px";
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: HER DREAM'S DREAM'S DREAM!!"); 
            newDiv.appendChild(newContent);

            await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
            
            img.style.height = "190px";
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: How is that possible?"); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Reimu_happy.png";
            
            await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: [Oh! You see, it's actually very plausible! If you consider a dream like a-]"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'purple';
            img.src = "portraits/Doremy_happy.png";
            
            await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: I DON'T WANNA KNOW THAT!!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_angry.png";
            img.style.height = "250px";
            
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            img.style.height = "190px";
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: HOW do I wake her up?"); 
            newDiv.appendChild(newContent);
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(2,1,5)});
            camkeys.push({frame:2*fps, value:new Vector3(9,1,2)});
            camkeys.push({frame:5*fps, value:new Vector3(9,1,2)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,3*Math.PI/4,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,3*Math.PI/4,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: [W-Well, you could enter her dream's dream's dream's dream.]"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'purple';
            img.src = "portraits/Doremy_sad.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(9,1,2)});
            camkeys.push({frame:5*fps, value:new Vector3(9,1,2)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,3*Math.PI/4,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,3*Math.PI/4,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Can't you have brighter ideas?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_sad.png";
            
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            this.Sumireko.rotate(Vector3.Forward(), -Math.PI/2);
            this.Sumireko.rotate(Vector3.Up(), Math.PI/2);
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: Why are you screaming like that, Reimers?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'brown';
            img.src = "portraits/Sumireko_sad.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: You sure took your time, sleepy head!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_bored.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(13,1,2)});
            camkeys.push({frame:4*fps, value:new Vector3(13,1,2)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,5*Math.PI/4,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,5*Math.PI/4,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Do you realise the mess you created out there?"); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Reimu_angry.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: Yes, I am aware of what I'm accountable for."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'brown';
            img.src = "portraits/Sumireko_sad.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: I was conscious about everything that was happening. It was not a great feelling."); 
            newDiv.appendChild(newContent);
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(13,1,2)});
            camkeys.push({frame:2*fps, value:new Vector3(7,1,1)});
            camkeys.push({frame:5*fps, value:new Vector3(7,1,1)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,5*Math.PI/4,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,5.5*Math.PI/4,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,5.5*Math.PI/4,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: It started when Okins asked me to help her with a task."); 
            newDiv.appendChild(newContent);
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(7,1,1)});
            camkeys.push({frame:5*fps, value:new Vector3(7,1,1)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,5.5*Math.PI/4,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,5.5*Math.PI/4,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Okins? You mean the Secret God?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_surprised.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: Yep."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'brown';
            img.src = "portraits/Sumireko_casual.png";
            
            await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: I should have gotten rid of her when I had the chance."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_bored.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: She gave me weird powers, and I started feeling sleepy."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'brown';
            img.src = "portraits/Sumireko_angry.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: Next thing you know, I started dreaming INSIDE my dream, and that started everything."); 
            newDiv.appendChild(newContent);
            
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: That must be one of her stupid tests again, she's so annoying."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_bored.png";
            
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();

            this.Reimu.position = new Vector3(12,3,0);
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Well, you don't have to worry. I'm gonna get us all out of here!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_casual.png";
            
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: Does that imply...?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'brown';
            img.src = "portraits/Sumireko_surprised.png";
            
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Yep! Beating you up!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(7,1,1)});
            camkeys.push({frame:1*fps, value:new Vector3(8,4,4)});
            camkeys.push({frame:4*fps, value:new Vector3(8,4,4)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,5.5*Math.PI/4,0)});
            rotkeys.push({frame:1*fps, value:new Vector3(0,3*Math.PI/4,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,3*Math.PI/4,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            this.Sumireko.position = new Vector3(-10,7,0);
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: I should not expect less from you, Reimers."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'brown';
            img.src = "portraits/Sumireko_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(8,4,4)});
            camkeys.push({frame:4*fps, value:new Vector3(8,4,4)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,3*Math.PI/4,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,3*Math.PI/4,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sumireko: At least, that means I get to fight you! I will not back down!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'brown';
            img.src = "portraits/Sumireko_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(8,4,4)});
            camkeys.push({frame:3*fps, value:new Vector3(19,4,0)});
            camkeys.push({frame:6*fps, value:new Vector3(19,4,0)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,3*Math.PI/4,0)});
            rotkeys.push({frame:3*fps, value:new Vector3(0,3*Math.PI/2,0)});
            rotkeys.push({frame:6*fps, value:new Vector3(0,3*Math.PI/2,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToFifthStageScene();
    }

    switchToFifthStageScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new FifthStageScene(this.canvas);
        setTimeout(() => {this.scene = next.scene;}, 200);
    }
}