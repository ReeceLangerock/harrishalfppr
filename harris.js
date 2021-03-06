const tables = document.querySelectorAll("table tbody");
const [standard, ppr] = tables;

if (tables.length !== 2) {
  console.log("The Harris Half-PPR tool can only be used for RB, WR and top 200 rankings");
} else {
  const standardRows = Array.from(standard.querySelectorAll("tr"));
  const pprRows = Array.from(ppr.querySelectorAll("tr"));

  pprRows.shift();
  standardRows.shift();

  const players = {};
  pprRows.forEach((row, index) => {
    try {
      index++;
      const name =
        row.querySelectorAll("td")[1].childNodes[0].nodeValue ||
        row.querySelectorAll("a")[0].textContent.split(" (")[0];

      const team = row.querySelectorAll("td")[2].childNodes[0].nodeValue;
      players[name] ? (players[name].ppr = index) : (players[name] = { ppr: index });
      players[name].team = team;
    } catch (e) {}
  });
  standardRows.forEach((row, index) => {
    try {
      index++;

      const name =
        row.querySelectorAll("td")[1].childNodes[0].nodeValue ||
        row.querySelectorAll("a")[0].textContent.split(" (")[0];
      const team = row.querySelectorAll("td")[2].childNodes[0].nodeValue;

      players[name] ? (players[name].standard = index) : (players[name] = { standard: index });
      players[name].team = team;
    } catch (e) {}
  });

  const oneTable = [];
  console.log(players);

  const hpprArray = Object.keys(players).map((player) => {
    const P = players[player];
    if (P.ppr && P.standard) {
      P.hppr = (P.ppr + P.standard) / 2;
      return {
        name: player,
        rank: P.hppr,
        team: P.team,
      };
    } else {
      const rank = P.ppr || P.standard;
      const type = P.ppr ? "PPR" : "Standard";
      oneTable.push({
        name: player,
        rank,
        team: P.team,
        type,
      });
    }
  });

  const sortedHppr = hpprArray.sort((a, b) => a.rank - b.rank);

  let tableContent = sortedHppr.map((row) => {
    if (row) {
      return (
        '<tr height:14.0pt><td class="xl66">' +
        row.rank +
        '</td><td class="xl67">' +
        row.name +
        '</td><td class="xl67">' +
        row.team +
        "</td></tr>"
      );
    }
  });
  let oneTableContent = oneTable.map((row) => {
    if (row) {
      return (
        '<tr height:14.0pt><td class="xl66">' +
        row.rank +
        '</td><td class="xl67">' +
        row.name +
        '</td><td class="xl67">' +
        row.team +
        '</td><td class="xl66"' +
        row.type +
        "</td></tr>"
      );
    }
  });

  tableContent = tableContent.join("");
  oneTableContent = oneTableContent.join("");

  const table = document.createElement("div");
  table.className += "col sqs-col-6 span-6";
  table.style.padding = "17px 15px";
  table.style.width = "260px";
  table.innerHTML = `<b>Half-Point PPR!</b><table style = "width: 260px;">${tableContent}</table><hr/><h4>These players appeared in only one table</h4><table>${oneTableContent}</table><p>These rankings were programmatically generated by the Harris Half-PPR Chrome extension as an average of the standard and PPR rankings</p>`;
  const t2 = document.querySelectorAll(".sqs-col-6.span-6")[1];
  t2.parentNode.insertBefore(table, t2.nextSibling);
}
