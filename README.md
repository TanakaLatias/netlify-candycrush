（２０２４．７．３０）
デプロイ成功
https://netlify-candycrush.netlify.app/

（２０２４．７．２８）
Netlify へのデプロイにともないいくつか変更を加えました。

（２０２４．２．１１）
以下の Youtube ハンズオン教材を真似して書いたキャンディークラッシュゲームです。
以下のように一部内容を変更しています。
・npm run build コマンドを実行すると useEffect の依存関係のエラーが出たため第二引数を追加した。
・他に build の際に useCallback でラップしなければならない関数があったのでそのようにした。
・揃ったキャンディが消える前に黒い線で囲うことで、いきなり消えてしまわず、プレイヤーから見て消える場所を分かりやすくした。
・3 個揃った時消えるだけでなく5個まで対応できるようにした。

［Candy Crush in React］https://www.youtube.com/watch?v=PBrEq9Wd6_U