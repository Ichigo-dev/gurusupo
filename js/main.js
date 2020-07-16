Vue.component('paginate', VuejsPaginate)

/***************************************************************
 ** Vueインスタンスの生成
 ****************************************************************/

var app = new Vue({
    el: "#app",
    data: {
        // グーグルマップ設定
        lat: 35.6809591,
        lng: 139.7673068,
        result: "",

        // ページネーション設定
        parPage: 10,
        currentPage: 1,

        scrollY: 0
    },
    watch: {
        // この関数は result が変わるごとに実行される
        result: function() {
            this.result.rest.map((item, index) => {
                //地図中に各店舗のマーカーを作成
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(item.latitude, item.longitude),
                    title: item.name,
                    label: {
                        text: String(index + 1),
                        color: "#fff",
                        fontWeight: 'bold',
                        fontSize: '14px'
                    },
                });

                // マーカーを地図中にセットする
                marker.setMap(map);
            });
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll)
    },
    methods: {
        // ページネーションクリック時にcurrentPageを更新
        clickCallback: function(pageNum) {
            this.currentPage = Number(pageNum);
        },

        // スクロールイベント
        scrollTop: function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
        scrollBottom: function() {
            window.scrollTo({
                top: 700,
                behavior: "smooth"
            });
        },


        handleScroll() {
            this.scrollY = window.scrollY
        }
    },
    computed: {
        // 現在ページのアイテムを返す
        getItems: function() {
            if (this.result !== "") { // resultが存在するときのみ実行
                let current = this.currentPage * this.parPage;
                let start = current - this.parPage;
                return this.result.rest.slice(start, current);
            }
        },
        // ページネーションの最大ページ数を求める
        getPageCount: function() {
            if (this.result !== "") // resultが存在するときのみ実行
                return Math.ceil(this.result.rest.length / this.parPage);
        }
    }
})

/***************************************************************
 ** グーグルマップの初期設定+現在地周辺の飲食店データの取得
 ****************************************************************/

function initMap() {
    let lat, lng, i;
    const url = "https://api.gnavi.co.jp/RestSearchAPI/v3/"

    navigator.geolocation.getCurrentPosition((position) => {

        // 緯度経度の取得

        app.lat = position.coords.latitude;
        app.lng = position.coords.longitude;

        // 緯度経度の取得
        latLng = new google.maps.LatLng(app.lat, app.lng);

        // 地図の作成
        map = new google.maps.Map(document.getElementById('map'), {
            center: latLng,
            zoom: 16
        });

        // グルナビのリクエストパラメータを作成
        const params = {
            keyid: "9be00fbaa95f4bcc1b759ab2072385e0",
            latitude: app.lat,
            longitude: app.lng,
            range: 5,
            hit_per_page: 50
        }


        $.getJSON(url, params, result => {
            app.result = result;
        })

    }, () => {
        //位置情報の取得に失敗したときはalertを表示させたあと
        //東京駅周辺を表示する

        alert('位置情報取得に失敗しました');
        // 緯度経度の取得
        latLng = new google.maps.LatLng(app.lat, app.lng);

        // 地図の作成
        map = new google.maps.Map(document.getElementById('map'), {
            center: latLng,
            zoom: 16
        });

        const params = {
            keyid: "9be00fbaa95f4bcc1b759ab2072385e0",
            latitude: app.lat,
            longitude: app.lng,
            range: 5,
            hit_per_page: 50
        }


        $.getJSON(url, params, result => {
            app.result = result;
        })
    });
}
