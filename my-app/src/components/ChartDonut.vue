<template>
  <div id="donutChart" :width="displaySunburst.sizes.sequenceW" height="auto">
    <div id="sequence">
      <svg :width="displaySunburst.sizes.sequenceW" height="80" id="trail">
        <text
          v-if="sequences.seqNames.length && notCenter(sequences.seqNames) && displaySunburst.sequence.endLabel.present"
          id="endlabel"
          :x="translatePolygon[translatePolygon.length - 1] + 15"
          y="15"
          dy="0.35em"
          text-anchor="start"
          style="fill: rgb(0, 0, 0);"
        >{{sequences.labelBudget}} {{displaySunburst.sequence.endLabel.unit}}</text>
        <g
          v-if="notCenter(sequences.seqNames)"
          v-for="(sequence, index) in sequences.seqNames"
          :transform="`translate(`+ translatePolygon[index] +`, 0)`"
        >
          <polygon
            :points="polygonPoints(sequence[0], sequences.seqNames)"
            :fill="colorScale(sequences.colorName)"
            fill-opacity="0.6"
          ></polygon>
          <text :id="`text_`+index" text-anchor="middle">
            <tspan
              v-for="(name, index) in sequence"
              :x="(sequence[0].length * pScale(sequence[0].length) + 10) / 2"
              :y="ySpan(sequence, sequences.seqNames)"
              :dy="sequence.length > 1 ? (index * 1.1) + `em` : `0.35em`"
            >{{name}}</tspan>
          </text>
        </g>
      </svg>
    </div>
    <div id="chart">
      <div>
        <svg
          :height="width"
          :width="width"
          :style="`margin-right: `+displaySunburst.sizes.margin+`px;`"
          @mouseleave="mouseleave"
        >
          <g fill-opacity="0.6" :transform="translateChart">
            <path
              v-for="(slice, index) in slices"
              :key="slice.id"
              :fill="index === 0 && !displaySunburst.slices.center.visibility ? `white` : colorScale(slice.parentName)"
              :id="`slice`+index"
              :d="arcSlice(slice)"
              style="cursor: pointer;"
              @click="clicked(index)"
              @mouseover="mLeave === 0 ? null : mouseover(index)"
            ></path>
          </g>
          <g
            v-if="displaySunburst.slices.text.present"
            pointer-events="none"
            text-anchor="middle"
            :transform="translateChart"
          >
            <text
              v-for="(text, index) in texts"
              :id="`text`+index"
              :transform="text.transform"
              dy="0.35em"
            >{{text.display ? text.name : null}}</text>
          </g>
        </svg>
      </div>
      <div id="sidebar" v-if="displaySunburst.legends.present">
        Legend
        <br>
        <div id="legend" style>
          <svg :width="legends.width * pScale(legends.width)" :height="legends.names.length * 33">
            <g
              v-for="(legend, index) in legends.names"
              :transform="`translate(0, `+ 33 * index +`)`"
            >
              <rect
                rx="3"
                ry="3"
                width="18"
                height="18"
                :fill="colorScale(legend)"
                fill-opacity="0.6"
              ></rect>
              <text x="22" y="9" dy="0.35em">{{legend.toUpperCase()}}</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  select,
  selectAll,
  scaleOrdinal,
  scaleLinear,
  partition,
  hierarchy,
  format,
  arc,
  quantize,
  interpolateRainbow,
  interpolate
} from "d3";
var TWEEN = require("@tweenjs/tween.js");

export default {
  name: "ChartDonut",
  props: {
    dataDonut: Object,
    width: {
      type: Number,
      default: 932
    },
    displaySunburst: Object
  },
  data: function() {
    let color = scaleOrdinal(
      quantize(interpolateRainbow, this.dataDonut.children.length + 1)
    );

    let pScale = scaleLinear();
    pScale.range([10, 6]).domain([5, 91]);

    return {
      targetIndex: 0,
      colorScale: color,
      pScale: pScale,
      tweenedCoord: [],
      targetCoords: [],
      mLeave: false,
      sequences: {
        colorName: null,
        seqNames: [],
        labelBudget: null
      }
    };
  },
  computed: {
    root: function() {
      let root = hierarchy(this.dataDonut)
        .sum(d => {
          return d.value;
        })
        .sort((a, b) => b.value - a.value);

      this.partition(root);
      console.log("root", root.descendants().slice(2), root.descendants());

      function searchMaxDepth(p) {
        let maxDepth = 0;
        p.each(elem => {
          if (elem.children)
            elem.children.forEach(child => {
              searchMaxDepth(child);
            });
          maxDepth = elem.depth;
        });
        return maxDepth;
      }

      let i = -1;
      root.each(d => {
        ++i;
        return (d.position = i);
      });

      if (this.targetIndex) {
        let p = root.descendants()[this.targetIndex];
        let maxDepth = searchMaxDepth(p);
        let newPartY = (this.radius - 30) / (maxDepth - p.depth + 1);
        let r0Scale = scaleLinear();
        let r1Scale = scaleLinear();

        r0Scale.range([30, this.radius - newPartY]).domain([p.depth, maxDepth]);
        r1Scale.range([newPartY + 30, this.radius]).domain([p.depth, maxDepth]);
        root.each(d => {
          let newX0 =
              Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            newX1 =
              Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            newY0 =
              newX1 - newX0 === 2 * Math.PI && d.data.name !== p.data.name
                ? 0
                : r0Scale(d.depth),
            newY1 =
              newX1 - newX0 === 2 * Math.PI && d.data.name !== p.data.name
                ? 30
                : r1Scale(d.depth);
          return (d.target = {
            x0: newX0,
            x1: newX1,
            y0: newY0,
            y1: newY1
          });
        });
      }
      return root;
    },
    radius: function() {
      return this.width / 2;
    },
    partition: function() {
      return partition().size([2 * Math.PI, this.radius]);
    },
    arcSlice: function() {
      let arcSlice = arc()
        .startAngle(d => {
          return d.x0;
        })
        .endAngle(d => {
          return d.x1;
        })
        .padAngle(d => {
          return Math.min((d.x1 - d.x0) / 2, 0.005);
        })
        .padRadius(this.radius / 2)
        .innerRadius(d => {
          return d.y0;
        })
        .outerRadius(d => {
          return d.y1 - 1;
        });
      return arcSlice;
    },
    slices: function() {
      function lookUpForParentName(slice) {
        if (slice.parent && slice.parent.depth > 0) {
          return lookUpForParentName(slice.parent);
        } else {
          return slice.data.name;
        }
      }

      let amppedSlices = this.root.descendants().map(slice => {
        if (slice.parent) {
          slice.parentName = lookUpForParentName(slice);
        } else slice.parentName = "";
        slice.current = {
          x0: slice.x0,
          x1: slice.x1,
          y0: slice.y0,
          y1: slice.y1
        };

        return slice;
      });
      this.currentCoords = amppedSlices.map(slice => slice.current);
      if (amppedSlices[0].target) {
        this.targetCoords = amppedSlices.map(elem => elem.target);
      }
      if (this.targetIndex === 0) {
        this.targetCoords = this.currentCoords;
      }
      return amppedSlices;
    },
    texts: function() {
      let textData = this.root.descendants().map(d => {
        let x0 = d.target ? d.target.x0 : d.x0,
          x1 = d.target ? d.target.x1 : d.x1,
          y0 = d.target ? d.target.y0 : d.y0,
          y1 = d.target ? d.target.y1 : d.y1;
        const x = (((x0 + x1) / 2) * 180) / Math.PI;
        const y = (y0 + y1) / 2;
        let display = ((y0 + y1) / 2) * (x1 - x0) > 10 && y0 !== 0;
        let transform = `rotate(${x - 90}) translate(${y},0) rotate(${
          x < 180 ? 0 : 180
        })`;
        let name = d.data.name;
        return {
          display: display,
          name: name,
          transform: transform
        };
      });
      return textData;
    },
    translateChart: function() {
      return `translate(${this.width / 2}, ${this.width / 2})`;
    },
    translatePolygon: function() {
      let antL = 0;
      let b = [];
      this.sequences.seqNames.forEach((elem, i) => {
        let l = 0;
        if (i !== 0) l = antL * this.pScale(antL) + 2 + b[i - 1];
        b.push(l);
        antL = elem[0].length;
        i++;
      });
      // x label budget
      b.push(antL * this.pScale(antL) + 2 + b[b.length - 1]);
      return b;
    },
    legends: function() {
      this.proportionTextSeq();
      let legendsNames = this.root
        .descendants()
        .filter(elem => elem.depth === 1)
        .map(elem => elem.data.name);
      let longestName = 0;

      legendsNames.forEach(elem => {
        if (longestName < elem.length) longestName = elem.length;
      });
      return {
        names: legendsNames,
        width: longestName
      };
    }
  },
  watch: {
    targetCoords: function(newSet, oldSet) {
      function animate() {
        if (TWEEN.update()) {
          requestAnimationFrame(animate);
        }
      }
      newSet.forEach((elem, i) => {
        new TWEEN.Tween(oldSet.length ? oldSet[i] : this.currentCoords[i])
          .to(elem, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(set => {
            const x = (((set.x0 + set.x1) / 2) * 180) / Math.PI;
            const y = (set.y0 + set.y1) / 2;
            select("#slice" + i).attr("d", this.arcSlice(set));
            select("#text" + i).attr(
              "transform",
              `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
            );
          })
          .start();
      });
      animate();
    }
  },
  methods: {
    reduceNbW(wordAr, sizeSeq, sizeLabel) {
      let nbWords = wordAr.map(arrayW => arrayW.length);
      let maxNbWords = Math.max(...nbWords);
      wordAr = wordAr.map(elem => {
        if (elem.length === maxNbWords) elem = elem.slice(0, elem.length - 1);
        return elem;
      });
      let array = wordAr.map(
        elem => elem.join(" ").length * this.pScale(elem.join(" ").length) + 10
      );

      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let sumW = array.reduce(reducer);
      if (sumW > sizeSeq - sizeLabel)
        return this.reduceNbW(wordAr, sizeSeq, sizeLabel);

      wordAr = wordAr.map(elem => elem.join(" "));
      return wordAr;
    },
    reduceSecondLine: function(word, tspan, newSpan) {
      let splitSpan = tspan.split(/\s+/);
      let l = 0,
        index = 0;
      splitSpan.forEach((spanWord, i) => {
        l += spanWord.length + 1;
        if (l <= word.length + 1) index = i;
      });
      let newSpan1 = splitSpan.slice(0, index + 1).join(" ");
      let newSpan2 = splitSpan.length > 1 ? splitSpan.slice(index + 1, splitSpan.length).join(" ") : null;
      newSpan.push(newSpan1);

      if (newSpan2 && newSpan2.length > word.length)
        return this.reduceSecondLine(word, newSpan2, newSpan);
      else if (newSpan2) newSpan.push(newSpan2);
      console.log("array span", newSpan);
      console.log("newSpan", newSpan1, newSpan1.length);
      // console.log("newSpan", newSpan2, newSpan2.length);
      console.log("tspan", tspan, tspan.length);
      console.log("word", word, word.length);
      return newSpan;
    },
    proportionTextSeq: function() {
      let newSeqNames = this.sequences.seqNames;
      console.log("first", this.sequences.seqNames);
      if (this.sequences.seqNames.length) {
        let array = this.sequences.seqNames.map(
          elem => elem[0].length * this.pScale(elem[0].length) + 10
        );

        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;

        let endLabelW = 120,
          endLabelP = 15;

        let sumW = array.reduce(reducer);

        if (
          sumW >
          this.displaySunburst.sizes.sequenceW - endLabelW - endLabelP
        ) {
          let wordAr = this.sequences.seqNames.map(elem =>
            elem[0].split(/\s+/)
          );
          wordAr = this.reduceNbW(
            wordAr,
            this.displaySunburst.sizes.sequenceW,
            endLabelW + endLabelP
          );
          console.log("word", wordAr);
          newSeqNames = this.sequences.seqNames.map((elem, i) => {
            if (elem[0] !== wordAr[i]) {
              let tspan = elem[0].split(wordAr[i] + " ");
              elem = [wordAr[i], tspan[1]];
              if (wordAr[i].length < tspan[1].length) {
                let newSpan = [];
                newSpan = this.reduceSecondLine(wordAr[i], tspan[1], newSpan);
                elem = [wordAr[i]].concat(newSpan);
              }
            }
            return elem;
          });
          console.log("new", newSeqNames, wordAr);
          newSeqNames.forEach(elem => console.log("elem", elem[0]));
          this.sequences.seqNames = newSeqNames;
        }
      }
    },
    notCenter(names) {
      if (
        names[0][0] === this.root.descendants()[0].data.name.toUpperCase() &&
        !this.displaySunburst.slices.center.visibility
      ) {
        return false;
      }
      return true;
    },
    polygonPoints(sequence, allNames) {
      let allLength = allNames.map(elem => elem.length);
      let maxL = Math.max(...allLength);
      let a = sequence.length * this.pScale(sequence.length),
        b = a + 10,
        c = maxL > 2 ? (maxL + 1) * 10 : 30,
        d = maxL > 2 ? 5 + maxL * 5 : 15;
      console.log("b", b, sequence, allLength);
      return (
        "0,0 " +
        a +
        ",0 " +
        b +
        "," +
        d +
        " " +
        a +
        "," +
        c +
        " 0," +
        c +
        " 10," +
        d
      );
    },
    ySpan: function(sequence, allNames) {
      let allLength = allNames.map(elem => elem.length);
      let maxL = Math.max(...allLength);

      let ySpanScale = scaleLinear()
      ySpanScale.range([(maxL + 1) * 5, 15]).domain([1, maxL - 1]);
      return sequence.length === maxL ? (maxL === 1 ? 15 : 13) : ySpanScale(sequence.length)
    },
    clicked(index) {
      this.targetIndex = index;
      this.$emit("onClick", this.root.descendants()[index]);
    },

    mouseover(index) {
      function mouseOnCenter(doc) {
        doc.mLeave = true;
        const turnOnHover = () => {
          doc.mLeave = false;
          doc.sequences.seqNames = [];
        };

        selectAll("#chart path")
          .transition()
          .duration(500)
          .style("opacity", 1)
          .on("end", function() {
            turnOnHover();
          });
      }
      function overParents(slice, doc, centerVisibility) {
        if (slice.parent && slice.parent.depth > 0) {
          select("#slice" + slice.parent.position).style("opacity", 1);
          overParents(slice.parent);
        } else if (slice.depth === 0 && !centerVisibility) {
          mouseOnCenter(doc);
        }
      }
      function setSequence(slice) {
        if (slice.parent && slice.parent.depth > 0) {
          seqNames.push(slice.parent.data.name.toUpperCase());
          setSequence(slice.parent);
        }
      }

      selectAll("#chart path").style("opacity", 0.3);
      select("#slice" + index).style("opacity", 1);
      overParents(
        this.root.descendants()[index],
        this,
        this.displaySunburst.slices.center.visibility
      );
      this.sequences.colorName = this.root.descendants()[index].parentName;

      let seqNames = [];
      seqNames.push(this.root.descendants()[index].data.name.toUpperCase());
      setSequence(this.root.descendants()[index]);
      seqNames = seqNames.reverse();
      this.sequences.seqNames = seqNames.map(elem => {
        let arrayName = [];
        arrayName.push(elem);
        return arrayName;
      });
      console.log("seq", this.sequences.seqNames);
      let budget = this.root.descendants()[index].data.value
        ? this.root.descendants()[index].data.value / 1000000
        : this.root.descendants()[index].data.budget / 1000000;
      this.sequences.labelBudget = budget.toFixed(2);
    },

    mouseleave() {
      this.mLeave = true;
      const turnOnHover = () => {
        this.mLeave = false;
        this.sequences.seqNames = [];
      };

      selectAll("#chart path")
        .transition()
        .duration(500)
        .style("opacity", 1)
        .on("end", function() {
          turnOnHover();
        });
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
text {
  font: 10px sans-serif;
}
#chart {
  display: flex;
}
#endlabel {
  font: 12px sans-serif;
  font-weight: bold;
}
</style>