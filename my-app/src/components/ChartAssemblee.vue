<template>
  <div v-if="isLoaded" class="container">
    <ChartDonut
      :dataDonut="donutBudget"
      :width="width"
      @onClick="searchYearsData"
      :displaySunburst="displaySunburst"
    />
    <Chartlines
      v-if="currentData.yearsData.length"
      :lines="currentData.yearsData"
      :width="linesW"
      :height="linesH"
      curve="curveLinear"
      scale="time"
      :title="currentData.name"
      :legends="legends"
    />
  </div>
</template>
<script>
import {
  select,
  selectAll,
  scaleOrdinal,
  partition,
  hierarchy,
  format,
  arc,
  quantize,
  interpolateRainbow,
  interpolate,
  scaleLinear,
  dsv
} from "d3";
var TWEEN = require("@tweenjs/tween.js");
import ChartDonut from "@/components/ChartDonut.vue";
import Chartlines from "@/components/ChartLines";

export default {
  name: "ChartAssemblee",
  components: {
    ChartDonut,
    Chartlines
  },
  props: {
    width: {
      type: Number,
      default: 500
    }
  },
  data: function() {
    return {
      donutBudget: {
        name: "Budget",
        children: []
      },
      currentData: {
        name: null,
        yearsData: []
      },
      isLoaded: false,
      linesW: 500,
      linesH: 200,
      legends: {
        display: "frame",
        names: ["Prévisions budgetaires", "Dépenses réalisées"]
      },
      displaySunburst: {
        color: {
          colorScale: Function,
          opacity: 0.6,
          childrenOpacity: {
            present: false,
            opacity: 0.6
          }
        },
        nbRing: "all",
        slices: {
          zoomable: true,
          text: {
            present: false,
            font: {
              size: "10px",
              family: "sans-serif"
            },
            rotation: "transform string"
          },
          joinSmallestSlices: true,
          center: {
            visibility: false
          },
          hover: true
        },
        sizes: {
          margin: 30,
          sunburstW: this.width,
          legendW: 300,
          sequenceW: this.width + 300 + 30
        },
        legends: {
          present: true,
          position: "right",
          clickable: true
        },
        sequence: {
          present: true,
          position: "top",
          endLabel: {
            present: true,
            unit: "Million d'euros"
          }
        }
      }
    };
  },
  created: async function() {
    let extractData = null;
    let csv = dsv(";", "BudgetsAN_2012-2017.csv").then(data => {
      extractData = data;
    });
    await csv;

    let index_1 = -1;
    let index_2 = -1;

    extractData.forEach((elem, i) => {
      let code = elem[""].split("/");
      let name = elem.Libellé;
      let budget = parseInt(elem["Réalisé 2017"].replace(/\s/g, ""));
      let budgetProgess = [[], []];

      budgetProgess[0].push(
        {
          x: new Date(2012, 0),
          y:
            parseInt(
              elem[
                "Budget 2012 avec budget supplémentaire SAIP mai 2012"
              ].replace(/\s/g, "")
            ) / 1000000
        },
        {
          x: new Date(2013, 0),
          y: parseInt(elem["Budget 2013"].replace(/\s/g, "")) / 1000000
        },
        {
          x: new Date(2014, 0),
          y: parseInt(elem["Budget 2014"].replace(/\s/g, "")) / 1000000
        },
        {
          x: new Date(2015, 0),
          y: parseInt(elem["Budget 2015"].replace(/\s/g, "")) / 1000000
        },
        {
          x: new Date(2016, 0),
          y: parseInt(elem["Budget 2016"].replace(/\s/g, "")) / 1000000
        },
        {
          x: new Date(2017, 0),
          y: parseInt(elem["Budget 2017"].replace(/\s/g, "")) / 1000000
        }
      );
      budgetProgess[1].push(
        {
          x: new Date(2012, 0),
          y: parseInt(elem["Réalisé 2012"].replace(/\s/g, "")) / 1000000
        },
        {
          x: new Date(2013, 0),
          y: parseInt(elem["Réalisé 2013"].replace(/\s/g, "")) / 1000000
        },
        {
          x: new Date(2014, 0),
          y: parseInt(elem["Réalisé 2014"].replace(/\s/g, "")) / 1000000
        },
        {
          x: new Date(2015, 0),
          y: parseInt(elem["Réalisé 2015"].replace(/\s/g, "")) / 1000000
        },
        {
          x: new Date(2016, 0),
          y: parseInt(elem["Réalisé 2016"].replace(/\s/g, "")) / 1000000
        },
        {
          x: new Date(2017, 0),
          y: parseInt(elem["Réalisé 2017"].replace(/\s/g, "")) / 1000000
        }
      );
      // console.log(budgetProgess)
      // console.log(typeof(budget), budget, elem["Réalisé 2017"])
      // elem["Budget 2012 avec budget supplémentaire SAIP mai 2012"]
      // console.log(code[0][0], name)
      if (
        code[0].length > 2 &&
        code[0][0] !== "7" &&
        code[0].slice(0, 2) !== "64" &&
        code[0].slice(0, 2) !== "65"
      ) {
        if (name.match(/[A-ZÀ-ÖŒ'\.\s]/g).length === name.length) {
          ++index_2;
          if (!this.donutBudget.children[index_1].children) {
            this.donutBudget.children[index_1]["children"] = [];
          }
          this.donutBudget.children[index_1].children.push({
            name: name,
            code: code,
            budget: budget,
            budgetProgess: budgetProgess
          });
        } else if (
          budget &&
          this.donutBudget.children[index_1].children[index_2].budget !== budget
        ) {
          if (!this.donutBudget.children[index_1].children[index_2].children) {
            this.donutBudget.children[index_1].children[index_2][
              "children"
            ] = [];
          }
          this.donutBudget.children[index_1].children[index_2].children.push({
            name: name,
            code: code,
            value: budget,
            budgetProgess: budgetProgess
          });
        } else if (
          this.donutBudget.children[index_1].children[index_2].budget === budget
        ) {
          if (
            this.donutBudget.children[index_1].children[index_2].budget ===
            this.donutBudget.children[index_1].budget
          )
            this.donutBudget.children[index_1]["value"] = budget;
          else
            this.donutBudget.children[index_1].children[index_2][
              "value"
            ] = budget;
        }
      } else if (
        code[0].length === 2 &&
        code[0][0] !== "7" &&
        code[0].slice(0, 2) !== "64" &&
        code[0].slice(0, 2) !== "65"
      ) {
        ++index_1;
        index_2 = -1;
        if (!this.donutBudget.children) {
          this.donutBudget["children"] = [];
        }
        this.donutBudget.children.push({
          name: name,
          code: code,
          budget: budget,
          budgetProgess: budgetProgess
        });
      }
    });
    console.log("donut", this.donutBudget);
    this.isLoaded = true;
  },
  methods: {
    searchYearsData(yearsData) {
      console.log("data years", yearsData);
      this.currentData.yearsData = yearsData.data.budgetProgess
        ? yearsData.data.budgetProgess
        : [];
      this.currentData.name = yearsData.data.name ? yearsData.data.name : null;
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
text {
  font: 10px sans-serif;
}
.container {
  display: flex;
}
</style>