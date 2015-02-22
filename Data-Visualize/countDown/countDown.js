var Moment = window.moment;


function plot(options) {

    options = _.extend({
        itemPadding: 3,
        padding: 5,
        width: 450,
        height: 450
    }, options);
    var lifeYear = options.lifeYear;
    var birthday = options.birthday;
    var lifeMonth = calculateLifeMonth(birthday, lifeYear);
    var width = options.width;
    var height = options.height;

    var monthData = _.range(1, lifeMonth);
    var countDown = d3.select(".countDown");

    countDown.style('height', height);
    countDown.style('width', width);
    countDown.style('border', '1px solid #ccc');

    var columnNum, rowNum;
    columnNum = rowNum = Math.ceil(Math.sqrt(lifeMonth));
    var itemHoriPadding, itemVertPadding;
    itemHoriPadding = itemVertPadding= options.itemPadding;
    var padding = options.padding;

    var rectWidth = (width - padding * 2 - itemHoriPadding * (columnNum - 1)) / columnNum;
    var rectHeight = (height - padding * 2 - itemVertPadding * (rowNum - 1)) / rowNum;

    var month = countDown.selectAll("circle")
            .data(monthData)
            .text(String);

    var livedMonth = new Moment().diff(birthday, 'month');

    month.enter()
        .append("rect")
        .text(String)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("x", function (d) {
            var col = (d - 1) % columnNum;
            return col * (itemHoriPadding + rectWidth) + padding;
        })
        .attr("y", function (d) {
            var row = Math.floor((d -1) / columnNum);
            return row * (itemVertPadding + rectHeight) + padding;
        })
        .style("fill", function(d) {
            if (d < livedMonth) {
                return 'red';
            } else {
                return '#43B2DF';
            }
        });

    // Exit…
    month.exit().remove();
}


function calculateLifeMonth(birthday, lifeYear) {
    var mBirthday = new Moment(birthday);
    var month = mBirthday.month();
    return lifeYear * 12 - month;
}


plot({
    width: 350,
    height: 350,
    padding: 10,
    itemPadding: 4,
    lifeYear: 70,
    birthday: '1989-10-23'
});