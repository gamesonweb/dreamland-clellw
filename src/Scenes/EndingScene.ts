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
    CreateSoundAsync,
} from "@babylonjs/core";
import { FireProceduralTexture } from "@babylonjs/procedural-textures";
import "@babylonjs/loaders";

export class EndingScene { 

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

                this.CreateStageFiveReimu();
                this.CreateStageFiveMap();
                
    
            const newDiv = document.createElement("div"); 
            const newContent = document.createTextNode("The End");
            newDiv.appendChild(newContent);
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
            newDiv.style.borderColor= 'magenta';
            newDiv.style.borderStyle= 'ridge ';
            newDiv.style.fontFamily= 'Bahnschrift';
            document.body.appendChild(newDiv); 
                return scene;
        }
    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(5,1,0), scene);
        this.camera.checkCollisions = false;
        this.camera.rotation = new Vector3(-Math.PI/25,3*Math.PI/4,0);
        this.camera.speed = 0.5;
    }
        async CreateStageFiveMap(): Promise<void> {
        
                const sumireko = await SceneLoader.ImportMeshAsync(
                    "",
                    "./models/",
                    "sumireko.glb"
                );
                this.Sumireko = sumireko.meshes[0];
                this.Sumireko.scaling.setAll(0.4);
                this.Sumireko.position = new Vector3(13,0,-3);
                this.Sumireko.rotate(Vector3.Up(), -3*Math.PI/4);

        const music = await CreateSoundAsync("music",
            "audio/09.UndellaTown(Autumn-Winter-Spring).mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
        }
        async CreateStageFiveReimu(): Promise<void> {
                const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
                    "",
                    "./models/",
                    "Reimu_animated.glb"
                  );
                this.Reimu = meshes[0];
                this.Reimu.position = new Vector3(12,0,-5);
                this.Reimu.rotate(Vector3.Up(),-3*Math.PI/4);
                this.Reimu.position._z -= 0.5;
                this.Reimu.scaling.setAll(0.4);
                console.log("animations", animationGroups);
                
                const idleAnim = animationGroups[1];
                const flightAnim = animationGroups[0];
                idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
                flightAnim.stop();
        }
}