window.onload = function(){
  ityped.init(document.querySelector("#ityped"), {
    strings: [
              "Leaning Cheese Tower of Pisa……",
            ],        //表示させたい文字の設定 区切りはカンマ 
    startDelay: 800,                                                  //アニメーション開始までの遅延、大きいほど遅れる
    typeSpeed: 100,                                                   //表示させるスピード、大きいほどゆっくり
    loop: false,                                                      //ループ
    backSpeed:  100,                                                   //戻るスピード
    backDelay:  1200,                                                  //戻る時間指定
    showCursor: true,                                                 //カーソル表示
    cursorChar: "|",                                                  //カーソルとして表示するテキスト
    
    // Goal:タイピングが終わったら3Dのチーズを表示する
    onFinished: function(){
      pause()
    }
  })

  function pause() {
    setTimeout(showModel, 2000)
  }

  function showModel() {
    // まずタイピングライブラリのDOMをthree.jsライブラリのcanvasに変更
    document.getElementById("ityped").innerHTML = "<canvas id='myCanvas'></canvas>";
    btn = document.getElementsByClassName("btn");
    head = document.getElementsByClassName("main_tittle");
    btn[0].removeAttribute("style");
    head[0].removeAttribute("style");

    // // サイズを指定
    const width = 900;
    const height = 900;
    
    //カメラを動かす用のラジアン定義
    let rot = 0;

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#myCanvas'),
      alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    // この初期位置が文字がいい感じになる方
    // camera.position.set(0, 0, 2000);
    // 初期位置
    camera.position.set(0, 0, 3000)

    // ライト設定
    ambientLight = new THREE.AmbientLight(0xffffff); //環境光源
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x4169e1, 0.5); //半球光源
    scene.add(hemisphereLight);
    scene.add(ambientLight)

    // 外部モデルデータを読み込み
    new THREE.MTLLoader().setPath('./models/cheese/')
     .load('cheese3.mtl',
     function(materials) {
      materials.preload();
      new THREE.OBJLoader().setPath('./models/cheese/').setMaterials(materials).load('cheese3.obj',
      function(object){

      // 最下段
      for (let i = 0; i < 15; i++){
        rot = 50;
        y = i * 10;
        for (let step = 0; step < 200; step++) {
          radian = (rot * Math.PI) / 180;

          objmodel = object.clone();
          objmodel.scale.set(3, 3, 3);      // 縮尺の初期化
          objmodel.rotation.set(0, 0, 0);         // 角度の初期化
          objmodel.position.set(120 * Math.sin(radian), y - 400, 120*Math.cos(radian) );         // 位置の初期化
          obj = new THREE.Object3D();
          obj.add(objmodel);
          scene.add(obj);
          rot -= 2;
        }
      }

      // 真ん中の円柱
      for (let i = 0; i < 76; i++){
        rot = 50;
        y = i * 10;
        for (let step = 0; step < 200; step++) {
          radian = (rot * Math.PI) / 180;

          objmodel = object.clone();
          objmodel.scale.set(3, 3, 3);      // 縮尺の初期化
          objmodel.rotation.set(0, 0, 0);         // 角度の初期化
          objmodel.position.set(80 * Math.sin(radian), y - 300, 80 * Math.cos(radian) );         // 位置の初期化
          obj = new THREE.Object3D();
          obj.add(objmodel);
          scene.add(obj);
          rot -= 2;
        }
      }

      // 途中途中の大円
      for (let i = 0; i < 6; i++){
        // 複数配置
        rot = 50;
        y = i * 100 + 100;
        // 円を作成
        for (let step = 0; step < 200; step++) {
          radian = (rot * Math.PI) / 180;

          objmodel = object.clone();
          objmodel.scale.set(3, 3, 3);      // 縮尺の初期化
          objmodel.rotation.set(0, 0, 0);         // 角度の初期化
          objmodel.position.set(120 * Math.sin(radian), y - 250, 120*Math.cos(radian) );         // 位置の初期化
          obj = new THREE.Object3D();
          obj.add(objmodel);
          scene.add(obj);
          rot -= 2;
        }
      }

      // 間の階層の細長いポール(まず塔の底から頂点までを伸ばして(内側のfor)、それを円を８等分した位置に配置する(外側のfor))
      for (let i = 0; i < 30; i++){
        y = 0;
        rot = i * 20;
        for (let step = 0; step < 75; step++) {
          radian = (rot * Math.PI) / 180;

          objmodel = object.clone();
          objmodel.scale.set(3, 3, 3);      // 縮尺の初期化
          objmodel.rotation.set(0, 0, 0);         // 角度の初期化
          objmodel.position.set(115 * Math.sin(radian), y - 400, 115 * Math.cos(radian) );         // 位置の初期化
          obj = new THREE.Object3D();
          obj.add(objmodel);
          scene.add(obj);
          y += 10;
        }
      }

      }
      );
     });

    // 初期化のために実行
    onResize();

    function onResize() {
      // サイズを取得
      const width = window.innerWidth;
      const height = window.innerHeight;

      // レンダラーのサイズを調整する
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      // カメラのアスペクト比を正す
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    animate();

    // 毎フレーム時に実行されるループイベントです
    function animate() {
      requestAnimationFrame(animate);//★追加 アニメーション実行
        rot += 0.5; // 毎フレーム角度を0.5度ずつ足していく
        // ラジアンに変換する
        const radian = (rot * Math.PI) / 180;
        // 角度に応じてカメラの位置を設定
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        camera.position.y = 1100 * Math.cos(radian);
        camera.rotation.y = 1000;

        // 原点方向を見つめる
        camera.lookAt(new THREE.Vector3(0, 0, 0));
      renderer.render(scene, camera);
    }

    //タイムラインで2秒時点になったら1/10のスピードに。
    //その後、正規のタイムラインで2.5秒時点になったら通常スピードに戻す。
  };
}