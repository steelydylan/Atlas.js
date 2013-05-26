/**
 * Atlas.js v0.1.0
 * https://github.com/steelydylan/Atlas.js
 * Copyright steelydylan
 * <ess_president@me.com>.
 * Released under the MIT license.
 * 参考 Gemmaの日記(http://d.hatena.ne.jp/Gemma/20070816)
 */
Atlas.setting(function () {
    var NO = 0;//なにもないところ
    var WALL = 2;//壁
    var ROOM = 3;//部屋
    var TRAIL = 4;//道
    var MapData;
    var C;//複雑さ
    var margin = 8;
    function Max(a, b) { return a > b ? a : b; };
    function Min(a, b) { return a < b ? a : b; };
    var Random = function (a, b) {
        return ~~(Math.random() * (b - a + 1)) + a;
    };
    function harf(data) {
        return Math.floor(data / 2);
    };
    function rectangle(x0, y0, x1, y1) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
    };
    Array.prototype.flatten = function (n) {
        var i = n || 1,
			f = function (ary) { return ary.reduce(function (a, b) { return a.concat(b) }, []) },
			r = f(this);
        for (; 1 < i--;) { r = f(r); };
        return r;
    };
    function split(rect) {
        if ((rect.x1 - rect.x0 < margin * 2) ||
            (rect.y1 - rect.y0 < margin * 2) ||
            (Random(0, 5) === 0)) {
            //以上が終了条件
            return [rect];
        } else {
            if (Random(0, 2) === 0) {
                //縦に分割
                var a = Random(rect.y0 + margin, rect.y1 - margin);
                return [new rectangle(rect.x0, rect.y0, rect.x1, a),
                    new rectangle(rect.x0, a, rect.x1, rect.y1)].map(split).flatten();
            } else {
                //横に分割
                var a = Random(rect.x0 + margin, rect.x1 - margin);
                return [new rectangle(rect.x0, rect.y0, a, rect.y1),
                    new rectangle(a, rect.y0, rect.x1, rect.y1)].map(split).flatten();
            }
        }
    };
    function make_rooms(partition) {
        var length = partition.length;
        var rooms = [];
        for (var i = 0; i < length; i++) {
            do {
                var ran_x0 = Random(3, harf(partition[i].x1 - partition[i].x0) - 1);
                var ran_y0 = Random(3, harf(partition[i].y1 - partition[i].y0) - 1);
                var ran_x1 = Random(3, harf(partition[i].x1 - partition[i].x0) - 1);
                var ran_y1 = Random(3, harf(partition[i].y1 - partition[i].y0) - 1);
            } while (((partition[i].x1 - ran_x1 - (partition[i].x0 + ran_x0))
                / (partition[i].y1 - ran_y1 - (partition[i].y0 + ran_y0)) > 2.0)
                || ((partition[i].y1 - ran_y1 - (partition[i].y0 + ran_y0))
                / (partition[i].x1 - ran_x1 - (partition[i].x0 + ran_x0)) > 2.0));
            rooms.push(new rectangle(partition[i].x0 + ran_x0,
                 partition[i].y0 + ran_y0,
                 partition[i].x1 - ran_x1,
                 partition[i].y1 - ran_y1));
        }
        return rooms;
    };
    function fill(box) {
        var min_j = Min(box.y0, box.y1);
        var max_j = Max(box.y0, box.y1);
        var min_i = Min(box.x0, box.x1);
        var max_i = Max(box.x0, box.x1);
        for (var j = min_j; j <= max_j; j++)
            for (var i = min_i; i <= max_i; i++)
                MapData[j][i] = 1;//TRAIL
    };
    function fillArray(rooms) {
        var length = rooms.length;
        for (var t = 0; t < length; t++) {
            var box = rooms[t];
            var min_j = Min(box.y0, box.y1) - 1;
            var max_j = Max(box.y0, box.y1) + 1;
            var min_i = Min(box.x0, box.x1) - 1;
            var max_i = Max(box.x0, box.x1) + 1;
            for (var j = min_j; j <= max_j; j++) {
                for (var i = min_i; i <= max_i; i++)
                    if (j == min_j || j == max_j || i == min_i || i == max_i)
                        MapData[j][i] = 0;//WALL
                    else
                        MapData[j][i] = 1;//ROOM	
            }
        }
    };
    function make_corrider(partitions, rooms) {
        var connect_list = new Array();
        var length = partitions.length - 1;
        for (var i = 0; i < length; i++)
            connect_list.push([i, i + 1]);
        for (var i = 0; i < partitions.length; i++)
            for (var j = i + 1; j < partitions.length; j++)
                if (Random(0, 5) == 0)
                    if (partitions[i].x0 == partitions[j].x1 ||
                      partitions[i].x1 == partitions[j].x0 ||
                      partitions[i].y0 == partitions[j].y1 ||
                      partitions[i].y1 == partitions[j].y0)
                        connect_list.push([i, j]);
        var connect = function (p0, p1, r0, r1) {
            if (p0 && p0.y1 == p1.y0) {
                var a = Random(r0.x0, r0.x1);
                var b = Random(r1.x0, r1.x1);
                fill(new rectangle(a, harf(p0.y0 + p0.y1), a, p0.y1));
                fill(new rectangle(b, harf(p1.y0 + p1.y1), b, p1.y0));
                fill(new rectangle(a, p0.y1, b, p1.y0));
            } else if (p0 && p0.x1 == p1.x0) {
                var a = Random(r0.y0, r0.y1);
                var b = Random(r1.y0, r1.y1);
                fill(new rectangle(harf(r0.x0 + r0.x1), a, p0.x1, a));
                fill(new rectangle(harf(r1.x0 + r1.x1), b, p1.x0, b));
                fill(new rectangle(p0.x1, a, p1.x0, b));
            }
        };
        for (var i in connect_list) {
            connect(partitions[connect_list[i][0]], partitions[connect_list[i][1]],
            rooms[connect_list[i][0]], rooms[connect_list[i][1]])
        }
    };
    Tile.prototype.getRandMap = function (width, height, complexity) {
        C = complexity;
        MapData = new Array(height);
        for (var j = 0; j < height; j++) {
            MapData[j] = new Array(width)
            for (var i = 0; i < width; i++) {
                MapData[j][i] = 0;
            }
        }
        var partition = split(new rectangle(0, 0, width - 1, height - 1));
        var rooms = make_rooms(partition);
        fillArray(rooms);
        make_corrider(partition, rooms);
        this.map = MapData;
        this.mapping = true;
    };
});