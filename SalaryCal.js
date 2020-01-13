
var CalculateCount = 0;
var ItemCount = 0;
$(document).ready(function () {
    $("#PayItem .short-box").each(function () {
        $(this).on("input", Calculate)
    });

    $("#advBanner").hide();
});

var ResetForm = function () {
    location.reload();
}

var Calculate = function () {
    $("#Results").hide();
    $("#Control").hide();
    $("#Social").hide();
    $("#Social").hide();

    var Gross = GetGross();
    var EPFTotal = GetEPFTotal();
    var TaxTotal = GetTaxTotal();

    var EPFCC = EPFTotal * 12 / 100;
    var EPFEC = EPFTotal * 8 / 100;
    var ETF = EPFTotal * 3 / 100;

    var PAYE = CalculateTax(TaxTotal);

    var Deductions = GetDeductions();

    var Net = Gross - EPFEC - PAYE - Deductions;
    // Result box
    $("#tEPF").text(formatCurrency(EPFEC));
    $("#tPAYE").text(formatCurrency(PAYE));
    $("#tNetSalary").text(formatCurrency(Net));

    //Payslip
    $("#TotalEarnings").html(formatCurrency(Gross));
    var Deductions = EPFEC + PAYE + Deductions;
    $("#TotalDeductions").html(formatCurrency(Deductions));
    $("#TotalForEPF").html(formatCurrency(EPFTotal));
    $("#EPF-Emp").html(formatCurrency(EPFEC));
    $("#EPF-Comp").html(formatCurrency(EPFCC));
    $("#ETF").html(formatCurrency(ETF));
    $("#TotalForTax").html(formatCurrency(TaxTotal));
    if (PAYE > 0) {
        $("#Tax").html(formatCurrency(PAYE));
    }
    else {
        $("#Tax").html("(Not Applicable)");
    }
    $("#NetSalary").text(formatCurrency(Net));

    if (!($("#tNetSalary").text() == "NaN") || ($("#tNetSalary").text() == "")) {
        $("#Results").fadeIn(1000);
        $("#Control").fadeIn(1500);
    }


    ShowEDValues(EPFEC, PAYE);

    CalculateCount += 1;
    ShowSocial();
}

var ShowEDValues = function (EPF, PAYE) {
    $("#EarningList").html("");
    $("#DeductionList").html("");

    $("#DeductionList").append("<tr><td>EPF (Employee Contr.)</td><td>" + formatCurrency(EPF) + "</td></tr>");
    if (PAYE > 0) {
        $("#DeductionList").append("<tr><td>P.A.Y.E.</td><td>" + formatCurrency(PAYE) + "</td></tr>");
    }

    $("#PayItem .short-box").each(function () {
        var Value = parseFloat($(this).val());
        var type = $(this).attr('data-type');
        var name = $(this).attr('data-name');
        if (type == 'ER') {
            $("#EarningList").append("<tr><td>" + name + "</td><td>" + formatCurrency(Value) + "</td></tr>");
        }
        else if (type == 'DD') {
            $("#DeductionList").append("<tr><td>" + name + "</td><td>" + formatCurrency(Value) + "</td></tr>");
        }
    });
}

var GetGross = function () {
    var ReturnValue = 0;
    $("#PayItem .short-box").each(function () {
        var Value = parseFloat($(this).val());
        var attr = $(this).attr('data-type');
        if (attr == 'ER') {
            ReturnValue += Value;
        }

    });
    return ReturnValue;
}

var GetEPFTotal = function () {
    var ReturnValue = 0;
    $("#PayItem .short-box").each(function () {
        var Value = parseFloat($(this).val());
        var attr = $(this).attr('data-epf');
        if (attr == 'Y') {
            attr = $(this).attr('data-type');
            if (attr == 'ER') {
                ReturnValue += Value;
            }
            else {
                ReturnValue -= Value;
            }

        }

    });
    return ReturnValue;
}

var GetTaxTotal = function () {
    var ReturnValue = 0;
    $("#PayItem .short-box").each(function () {
        var Value = parseFloat($(this).val());
        var attr = $(this).attr('data-tax');
        if (attr == 'Y') {
            attr = $(this).attr('data-type');
            if (attr == 'ER') {
                ReturnValue += Value;
            }
            else {
                ReturnValue -= Value;
            }

        }


    });
    return ReturnValue;
}

var CalculateTax = function (TaxTotal) {
    var ReturnValue;

    var method = $("#lnkTaxMethod").attr('data-method');
    
    if (method == "1") {
        if (TaxTotal < (250000)) {
            ReturnValue = 0;
        }
        else if (TaxTotal < (500000)) {
            ReturnValue = (TaxTotal * 6 / 100) - 15000;
        }
        else if (TaxTotal < (750000)) {
            ReturnValue = (TaxTotal * 12 / 100) - 45000;
        }
        else {
            ReturnValue = (TaxTotal * 18 / 100) - 90000;
        }
    }
    else {
        if (TaxTotal < (100000)) {
            ReturnValue = 0;
        }
        else if (TaxTotal < (150000)) {
            ReturnValue = (TaxTotal * 4 / 100) - 4000;
        }
        else if (TaxTotal < (200000)) {
            ReturnValue = (TaxTotal * 8 / 100) - 10000;
        }
        else if (TaxTotal < (250000)) {
            ReturnValue = (TaxTotal * 12 / 100) - 18000;
        }
        else if (TaxTotal < (300000)) {
            ReturnValue = (TaxTotal * 16 / 100) - 28000;
        }
        else if (TaxTotal < (350000)) {
            ReturnValue = (TaxTotal * 20 / 100) - 40000;
        }
        else {
            ReturnValue = (TaxTotal * 24 / 100) - 54000;
        }
    }


    return ReturnValue;
}

var ShowSocial = function () {
    //alert(CalculateCount);
    if (CalculateCount > 16) {
        $("#Social").delay(3500).fadeIn(2500);
        CalculateCount = 10;
    }

    if (CalculateCount > 3) {
        $("#advBanner").delay(4500).slideDown(3500);
        CalculateCount = 10;
    }
}

var GetDeductions = function () {
    var ReturnValue = 0;
    $("#PayItem .short-box").each(function () {
        var Value = parseFloat($(this).val());
        var attr = $(this).attr('data-type');
        if (attr == 'DD') {
            ReturnValue += Value;
        }

    });
    return ReturnValue;
}

function formatCurrency(total) {
    var neg = false;
    if (total < 0) {
        neg = true;
        total = Math.abs(total);
    }
    return (neg ? "-" : '') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}

var PrintPage = function () {
    window.print();
}

// Salary Editor

var AddNewItem = function () {
    var Html = $("#CopyHtml").find('tbody').html();
    ItemCount = ItemCount + 1;
    Html = Html.replace("$count$", ItemCount.toString());
    Html = Html.replace("$count$", ItemCount.toString());
    Html = Html.replace("$count$", ItemCount.toString());
    Html = Html.replace("$count$", ItemCount.toString());
    Html = Html.replace("$count$", ItemCount.toString());
    Html = Html.replace("$count$", ItemCount.toString());
    Html = Html.replace("$count$", ItemCount.toString());
    Html = Html.replace("$count$", ItemCount.toString());
    Html = Html.replace("$count$", ItemCount.toString());
    Html = Html.replace("$count$", ItemCount.toString());
    Html = Html.replace("$count$", ItemCount.toString());
    $('#PayItem').append($(Html));
    $('#PayItem').find('input:last').focus();
}

var RemoveItem = function (Id) {
    $("#row_" + Id).addClass("danger");
    $("#row_" + Id).fadeOut(500, "swing");
    setTimeout(function () {
        $("#row_" + Id).remove();
        Calculate();
    }, 500);



}

var ChangeItemType = function (Id) {
    var btn = $("#btnChange_" + Id);
    var attr = $("#row_" + Id + " .short-box").attr('data-type');

    if (attr == 'ER') {
        $("#row_" + Id + " .short-box").attr('data-type', 'DD');
        btn.removeClass("btn-success");
        btn.addClass("btn-warning");
        btn.html("-");
    }
    else {
        $("#row_" + Id + " .short-box").attr('data-type', 'ER');
        btn.removeClass("btn-warning");
        btn.addClass("btn-success");
        btn.html("+");
    }
    Calculate();
}

var ChangeEPF = function (id) {
    if ($("input[name='chkEPF_" + id + "']:checked").val() == "1") {
        $("#row_" + id + " .short-box").attr('data-epf', 'Y');
    }
    else {
        $("#row_" + id + " .short-box").attr('data-epf', 'N');
    }
    Calculate();
}

var ChangeTax = function (id) {
    if ($("input[name='chkTax_" + id + "']:checked").val() == "1") {
        $("#row_" + id + " .short-box").attr('data-tax', 'Y');
    }
    else {
        $("#row_" + id + " .short-box").attr('data-tax', 'N');
    }
    Calculate();
}


var ChangeItemName = function (id) {

    var itemName = $("#tPayItemName_" + id).val();
    $("#row_" + id + " .short-box").attr('data-name', itemName);

    Calculate();
}

var ChangeTaxMethod = function () {

    var method = $('#lnkTaxMethod').attr('data-method');

    if (method == "1") {
        method = "2"; // Old calculation method = 2
        $("#lnkTaxMethod").text('Use new tax calculation method (2019 Dec)');
        
    }
    else {
        method = "1"; // New calculation method
        $("#lnkTaxMethod").text('Use old tax calculation method');
    }

    $("#lnkTaxMethod").attr('data-method', method);

    Calculate();
}


Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

Date.prototype.getMonthName = function () {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};

//Payslip Generator
var GeneratePayslip = function () {
    $("#bGenerate").removeAttr("disabled");
    $("#loaderDiv").hide();

    var payDate = new Date($.now());
    payDate.setDate(payDate.getDate() + parseInt(-15));
    var PeriodText = payDate.getFullYear() + ' ' + payDate.getMonthName();
    $("#tPeriod").val(PeriodText);

    $("#PayslipEditor").modal('show');
    $("#tEmployeeNo").focus();
    $('#PayslipEditor').on('shown.bs.modal', function () {
        $('#tEmployeeNo').focus();
    })
}

var SavePaySlip = function (jsonURL) {
    var EmployeeNo = $("#tEmployeeNo").val();
    if (EmployeeNo == "") {
        alert('Employee No. cannot be empty');
        $("#tEmployeeNo").focus();
        return;
    }

    var EmployeeName = $("#tEmployeeName").val();
    if (EmployeeName == "") {
        alert('Employee name cannot be empty');
        $("#tEmployeeName").focus();
        return;
    }

    var DesignationName = $("#tDesignationName").val();
    if (DesignationName == "") {
        alert('Designation cannot be empty');
        $("#tDesignationName").focus();
        return;
    }

    var EmailAddress = $("#tEmailAddress").val();
    if (EmailAddress == "") {
        alert('Email cannot be empty');
        $("#tEmailAddress").focus();
        return;
    }

    if (!isValidEmailAddress(EmailAddress)) {
        alert('Invalid email address format.');
        $("#tEmailAddress").focus();
        return;
    }

    var CompanyName = $("#tCompanyName").val();
    if (CompanyName == "") {
        alert('Company cannot be empty');
        $("#tCompanyName").focus();
        return;
    }

    var Period = $("#tPeriod").val();
    if (Period == "") {
        alert('Month / Period cannot be empty');
        $("#tPeriod").focus();
        return;
    }

    var SendUpdate = "N";
    if ($("input[name='chkSendUpdate']:checked").val() == "on") {
        SendUpdate = "Y";
    }

    var NetSalary = $("#tNetSalary").text();

    $("#EmployeeName").html(EmployeeNo + " - " + EmployeeName);
    $("#DesignationName").html(DesignationName);
    $("#CompanyName").html(CompanyName);
    $("#PeriodName").html(Period);


    $("#bGenerate").attr("disabled", true);
    $("#loaderDiv").show();

    setTimeout(function () {
        $.ajax({
            type: "POST",
            url: jsonURL,
            data: { EmployeeNo: EmployeeNo, EmployeeName: EmployeeName, DesignationName: DesignationName, EmailAddress: EmailAddress, CompanyName: CompanyName, NetSalary: NetSalary, SendUpdate: SendUpdate },
            success: function (result) {
                $("#PayslipEditor").modal("hide");
                LoadPayslip();
            },
            error: function (result) {

            }
        })
    }, 500);
}

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};

var LoadPayslip = function () {
    $("#Payslip").fadeIn(2500);
}
