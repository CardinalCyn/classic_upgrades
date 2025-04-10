var SIM = SIM || {};
SIM.STATS = {
  init: function () {
    this.variables(), this.events();
  },
  variables: function () {
    (this.body = $("body")),
      (this.stats = this.body.find("section.stats")),
      (this.dmg = this.stats.find(".container-dmg canvas")),
      (this.dmglegend = this.stats.find(".container-dmg").siblings(".legend")),
      (this.aura = this.stats.find(".container-aura canvas")),
      (this.spread = this.stats.find(".container-spread canvas")),
      (this.colors = [
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
      ]),
      (this.close = this.stats.find(".btn-close")),
      (this.table = this.stats.find(".container-table"));
  },
  events: function () {
    const t = this;
    t.close.click(function (a) {
      a.preventDefault(),
        $(".js-stats").removeClass("active"),
        $("section.stats").removeClass("active"),
        t.body.addClass("sidebar-mobile-open");
    });
  },
  initCharts: function (t) {
    $(".js-stats").removeClass("disabled"),
      this.buildTable(t),
      this.buildData(t),
      this.buildAuras(),
      this.buildDamage(),
      this.buildSpread();
  },
  buildData: function (t) {
    let a = 0,
      e = [],
      s = [];
    this.auradata = { labels: [], datasets: [] };
    for (const d in t.player.auras) {
      const o = t.player.auras[d];
      o.uptime &&
        (this.auradata.labels.push(o.name),
        e.push(Math.min((o.uptime / t.totalduration / 10).toFixed(2), 100)),
        s.push(this.colors[a % this.colors.length]),
        a++);
    }
    this.auradata.datasets.push({ data: e, fill: !1, backgroundColor: s }),
      (a = 0),
      (e = []),
      (s = []),
      (this.dmgdata = { labels: [], datasets: [] });
    for (const d in t.player.spells) {
      const o = t.player.spells[d];
      o.totaldmg &&
        (this.dmgdata.labels.push(o.name),
        e.push((o.totaldmg / t.totalduration).toFixed(2)),
        s.push(this.colors[a % this.colors.length]),
        a++);
    }
    this.dmgdata.labels.push("Main Hand"),
      e.push((t.player.mh.totaldmg / t.totalduration).toFixed(2)),
      s.push(this.colors[a % this.colors.length]),
      a++,
      t.player.mh.totalprocdmg &&
        (this.dmgdata.labels.push("Main Hand Proc"),
        e.push((t.player.mh.totalprocdmg / t.totalduration).toFixed(2)),
        s.push(this.colors[a % this.colors.length]),
        a++),
      t.player.oh &&
        (this.dmgdata.labels.push("Off Hand"),
        e.push((t.player.oh.totaldmg / t.totalduration).toFixed(2)),
        s.push(this.colors[a % this.colors.length]),
        a++,
        t.player.oh.totalprocdmg &&
          (this.dmgdata.labels.push("Off Hand Proc"),
          e.push((t.player.oh.totalprocdmg / t.totalduration).toFixed(2)),
          s.push(this.colors[a % this.colors.length]),
          a++)),
      t.player.auras.deepwounds &&
        t.player.auras.deepwounds.totaldmg &&
        (this.dmgdata.labels.push(t.player.auras.deepwounds.name),
        e.push(
          (t.player.auras.deepwounds.totaldmg / t.totalduration).toFixed(2),
        ),
        s.push(this.colors[a % this.colors.length])),
      t.player.auras.deepwounds2 &&
        t.player.auras.deepwounds2.totaldmg &&
        (this.dmgdata.labels.push(t.player.auras.deepwounds2.name),
        e.push(
          (t.player.auras.deepwounds2.totaldmg / t.totalduration).toFixed(2),
        ),
        s.push(this.colors[a % this.colors.length])),
      t.player.auras.deepwounds3 &&
        t.player.auras.deepwounds3.totaldmg &&
        (this.dmgdata.labels.push(t.player.auras.deepwounds3.name),
        e.push(
          (t.player.auras.deepwounds3.totaldmg / t.totalduration).toFixed(2),
        ),
        s.push(this.colors[a % this.colors.length])),
      t.player.auras.deepwounds4 &&
        t.player.auras.deepwounds4.totaldmg &&
        (this.dmgdata.labels.push(t.player.auras.deepwounds4.name),
        e.push(
          (t.player.auras.deepwounds4.totaldmg / t.totalduration).toFixed(2),
        ),
        s.push(this.colors[a % this.colors.length])),
      t.player.auras.rend &&
        t.player.auras.rend.totaldmg &&
        (this.dmgdata.labels.push(t.player.auras.rend.name),
        e.push((t.player.auras.rend.totaldmg / t.totalduration).toFixed(2)),
        s.push(this.colors[a % this.colors.length])),
      t.player.auras.weaponbleedmh &&
        t.player.auras.weaponbleedmh.totaldmg &&
        (this.dmgdata.labels.push(t.player.auras.weaponbleedmh.name),
        e.push(
          (t.player.auras.weaponbleedmh.totaldmg / t.totalduration).toFixed(2),
        ),
        s.push(this.colors[a % this.colors.length])),
      t.player.auras.weaponbleedoh &&
        t.player.auras.weaponbleedoh.totaldmg &&
        (this.dmgdata.labels.push(t.player.auras.weaponbleedoh.name),
        e.push(
          (t.player.auras.weaponbleedoh.totaldmg / t.totalduration).toFixed(2),
        ),
        s.push(this.colors[a % this.colors.length])),
      this.dmgdata.datasets.push({ data: e, fill: !1, backgroundColor: s }),
      (e = []),
      (this.spreaddata = { labels: [], datasets: [] });
    for (const a in t.spread)
      this.spreaddata.labels.push(a), e.push(t.spread[a]);
    this.spreaddata.datasets.push({
      data: e,
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgb(255, 99, 132)",
      fill: "origin",
    });
  },
  buildAuras: function () {
    this.aurachart && this.aurachart.destroy(),
      (this.aurachart = new Chart(this.aura, {
        type: "horizontalBar",
        data: this.auradata,
        showTooltips: !1,
        options: {
          responsive: !0,
          maintainAspectRatio: !1,
          legend: { display: !1, align: "center", fullWidth: !0 },
          tooltips: { enabled: !1 },
          hover: { mode: null },
          title: {
            display: !1,
            text: "Aura Uptime",
            fontColor: "#ccc",
            position: "bottom",
          },
          scales: {
            yAxes: [
              { ticks: { fontColor: "#ccc" }, gridLines: { display: !1 } },
            ],
            xAxes: [
              {
                ticks: { beginAtZero: !0, min: 0, display: !1 },
                gridLines: { display: !1 },
              },
            ],
          },
          animation: {
            onComplete: function () {
              const t = this.chart,
                a = this.chart.ctx;
              this.data.datasets.forEach(function (e, s) {
                t.controller.getDatasetMeta(s).data.forEach(function (t, s) {
                  const d = e.data[s];
                  (a.fillStyle = "#ddd"),
                    (a.shadowOffsetX = 2),
                    (a.shadowOffsetY = 2),
                    (a.shadowColor = "rgba(0,0,0,0.5)"),
                    (a.shadowBlur = 4),
                    a.fillText(
                      d + "%",
                      parseInt(d) < 11 ? t._model.x + 10 : t._model.x - 50,
                      t._model.y + 5,
                    );
                });
              });
            },
          },
        },
      }));
  },
  buildDamage: function () {
    this.dmgchart && this.dmgchart.destroy(),
      (this.dmgchart = new Chart(this.dmg, {
        type: "pie",
        data: this.dmgdata,
        options: {
          elements: { arc: { borderWidth: 1 } },
          responsive: !0,
          maintainAspectRatio: !1,
          title: {
            display: !1,
            text: "DPS",
            fontColor: "#ccc",
            position: "bottom",
          },
          animation: { animateScale: !0, animateRotate: !0 },
          legend: {
            display: !1,
            position: "bottom",
            labels: { fontColor: "#ccc" },
          },
          tooltips: {
            callbacks: {
              label: (t, a) =>
                ` ${a.labels[t.index]}: ${a.datasets[0].data[t.index]} DPS`,
            },
          },
        },
      })),
      this.dmglegend.html(this.dmgchart.generateLegend());
  },
  buildTable: function (t) {
    this.table.empty();
    let a =
        "<table><thead><tr><th>Action</th><th>Hit %</th><th>Crit %</th><th>Miss %</th><th>Dodge %</th><th>Glance %</th><th>Uses</th><th>DPR</th><th>DPS</th></tr></thead><tbody>",
      e = t.iterations,
      s = t.player.mh.data,
      d = s.reduce((t, a) => t + a, 0),
      o = (t.player.mh.totaldmg / t.totalduration).toFixed(2);
    (a += `<tr><td>Main Hand</td><td>${((s[0] / d) * 100).toFixed(
      2,
    )}</td><td>${((s[3] / d) * 100).toFixed(2)}</td><td>${(
      (s[1] / d) *
      100
    ).toFixed(2)}</td><td>${((s[2] / d) * 100).toFixed(2)}</td><td>${(
      (s[4] / d) *
      100
    ).toFixed(2)}</td><td>${(d / e).toFixed(
      2,
    )}</td><td></td><td>${o}</td></tr>`),
      t.player.oh &&
        ((d = (s = t.player.oh.data).reduce((t, a) => t + a, 0)),
        (o = (t.player.oh.totaldmg / t.totalduration).toFixed(2)),
        (a += `<tr><td>Off Hand</td><td>${((s[0] / d) * 100).toFixed(
          2,
        )}</td><td>${((s[3] / d) * 100).toFixed(2)}</td><td>${(
          (s[1] / d) *
          100
        ).toFixed(2)}</td><td>${((s[2] / d) * 100).toFixed(2)}</td><td>${(
          (s[4] / d) *
          100
        ).toFixed(2)}</td><td>${(d / e).toFixed(
          2,
        )}</td><td></td><td>${o}</td></tr>`));
    for (const s in t.player.spells) {
      const d = t.player.spells[s].name,
        o = t.player.spells[s].data,
        l = o.reduce((t, a) => t + a, 0);
      if (!l) continue;
      let i = (t.player.spells[s].totaldmg / t.totalduration).toFixed(2),
        r = (
          t.player.spells[s].totaldmg /
          e /
          (t.player.spells[s].cost * (l / e))
        ).toFixed(2);
      "slam" == s && t.player.bloodsurge && (r = 1 / 0),
        "execute" == s &&
          (r = (
            t.player.spells[s].totaldmg /
            e /
            (t.player.spells[s].cost * (l / e) +
              t.player.spells[s].totalusedrage / e)
          ).toFixed(2)),
        (a += `<tr><td>${d}</td><td>${((o[0] / l) * 100).toFixed(2)}</td><td>${(
          (o[3] / l) *
          100
        ).toFixed(2)}</td><td>${((o[1] / l) * 100).toFixed(2)}</td><td>${(
          (o[2] / l) *
          100
        ).toFixed(2)}</td><td>${((o[4] / l) * 100).toFixed(2)}</td><td>${(
          l / e
        ).toFixed(2)}</td><td>${r}</td><td>${i}</td></tr>`);
    }
    if (t.player.auras.rend) {
      const s = t.player.auras.rend.data,
        d = s.reduce((t, a) => t + a, 0),
        o = t.player.auras.rend.totaldmg,
        l = (o / t.totalduration).toFixed(2),
        i = (o / e / (t.player.auras.rend.cost * (d / e))).toFixed(2);
      a += `<tr><td>${t.player.auras.rend.name}</td><td></td><td></td><td>${(
        (s[1] / d) *
        100
      ).toFixed(2)}</td><td>${((s[2] / d) * 100).toFixed(
        2,
      )}</td><td></td><td>${(d / e).toFixed(
        2,
      )}</td><td>${i}</td><td>${l}</td></tr>`;
    }
    (a += "</tbody></table>"),
      this.table.append(a),
      this.table.find("table").tablesorter({ widthFixed: !0 });
  },
  buildSpread: function () {
    this.spreadchart && this.spreadchart.destroy(),
      (this.spreadchart = new Chart(this.spread, {
        type: "bar",
        data: this.spreaddata,
        options: {
          responsive: !0,
          maintainAspectRatio: !1,
          spanGaps: !1,
          legend: { display: !1 },
          elements: { line: { tension: 0.4 }, point: { radius: 0 } },
          plugins: { filler: { propagate: !1 } },
          scales: {
            xAxes: [
              { ticks: { beginAtZero: !0, autoSkip: !0, maxRotation: 0 } },
            ],
          },
          tooltips: {
            callbacks: {
              label: (t, a) =>
                ` ${a.labels[t.index]} DPS: ${a.datasets[0].data[t.index]}`,
            },
          },
        },
      }));
  },
};
