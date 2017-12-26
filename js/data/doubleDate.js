
    $(document).ready(function() {
        var cb = function(start, end, label) {
            console.log(start.toISOString(), end.toISOString(), label);
            $('#reportrange span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
            //alert("Callback has fired: [" + start.format('MMMM D, YYYY') + " to " + end.format('MMMM D, YYYY') + ", label = " + label + "]");
        };

        var optionSet1 = {//控制自定义日历选择
            startDate: moment().subtract('days', 29),
            endDate: moment(),
            minDate: '01/01/2012',
            maxDate: '12/31/2014',
            dateLimit: { days: 60 },//起止时间的最大间隔
            showDropdowns: true,//年月下拉选择
            showWeekNumbers: true,//是否显示第几周
            timePicker: false,//是否显示小时和分钟
            timePickerIncrement: 1,//时间的增量，单位为分钟
            timePicker12Hour: true,//是否使用12小时制来显示时间
            ranges: {
                //'最近1小时': [moment().subtract('hours',1), moment()],
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                'Last 7 Days': [moment().subtract('days', 6), moment()],
                'Last 30 Days': [moment().subtract('days', 29), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
            opens: 'left',//日期选择框的弹出位置
            buttonClasses: ['btn btn-default'],
            applyClass: 'btn-small btn-primary',
            cancelClass: 'btn-small',
            format: 'YYYY-MM-DD',//控件中from和to 显示的日期格式
            separator: ' to ',
            locale: {
                applyLabel: '确定',
                cancelLabel: '取消',
                fromLabel: '开始时间',
                toLabel: '结束时间',
                customRangeLabel: '自定义时间',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            }
        };

        var optionSet2 = {//控制下拉固定时间选择
            startDate: moment().subtract('days', 7),
            endDate: moment(),
            opens: 'left',
            showDropdowns : true,
            format: 'YYYY-MM-DD',
            ranges: {
                //'今天': [moment(), moment()],
                '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                '最近7天': [moment().subtract('days', 6), moment()],
                '最近30天': [moment().subtract('days', 29), moment()],
                '本月': [moment().startOf('month'), moment().endOf('month')],
                '上月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            }
        };

        //$('#reportrange span').html(moment().subtract('days', 1).format('YYYY-MM-DD') + ' - ' + moment().subtract('days', 1).format('YYYY-MM-DD'));

        $('#reportrange').daterangepicker(optionSet1, cb);

        //$('#reportrange').on('show.daterangepicker', function() { console.log("show event fired"); });//下拉展开
        //$('#reportrange').on('hide.daterangepicker', function() { console.log("hide event fired"); });//下拉收起
        //$('#reportrange').on('apply.daterangepicker', function(ev, picker) {
        //    console.log("apply event fired, start/end dates are "
        //        + picker.startDate.format('YYYY-MM-DD')
        //        + " to "
        //        + picker.endDate.format('YYYY-MM-DD')
        //    );
        //});

        $('#reportrange').on('cancel.daterangepicker', function(ev, picker) { console.log("cancel event fired"); });

//                  $('#options1').click(function() {
//                    $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
//                  });

//                  $('#options2').click(function() {
        $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
//                  });

//                  $('#destroy').click(function() {
//                    $('#reportrange').data('daterangepicker').remove();
//                  });

    });
