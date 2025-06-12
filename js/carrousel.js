// Ce code utilise jQuery
$(document).ready(function () {
    const $carousel = $("#customCarousel");
    const $infoBox = $("#infoBox");

    function updateInfo(event) {
        const $firstVisible = $carousel.find('.owl-item.active .item').first();

        $infoBox.addClass('animAppar');

        setTimeout(() => {

            const nom = $firstVisible.data('nom');
            const score1 = $firstVisible.data('score1');
            const score2 = $firstVisible.data('score2');
            const score3 = $firstVisible.data('score3');
            const description = $firstVisible.data('description');
            const image1 = $firstVisible.data('image');
            const image2 = $firstVisible.data('image2');
            const devtag = $firstVisible.data('devtag');
            const href = $firstVisible.data('href');

            $("#infoName").text(nom);
            $("#infoScore1").text(score1);
            $("#infoScore2").text(score2);
            $("#infoScore3").text(score3);
            $("#infoDesc").text(description);
            $("#infoImg1").attr('src', image1);
            $("#infoImg2").attr('src', image2);
            $("#infoDev").text(devtag);
            $("#infoBtnPlay").data('href', href);

            $infoBox.removeClass('animAppar');
        }, 400);
    }

    $('.owl-carousel').on('click', '.btn-play', function () {
        const item = $(this).closest('.item');
        const link = item.data('href');
        if (link) {
            window.location.href = link;
        }
    });

    $('#infoBtnPlay').on('click', function () {
        const link = $(this).data('href');
        if (link) {
            window.location.href = link;
        }
    });

    $('#btnQuitter').on('click', function () {
        $('#customCarousel').trigger('next.owl.carousel');
    });

    $carousel.owlCarousel({
        items: 6,
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        navText: [
            '<i class="fa-solid fa-circle-chevron-left"></i>',
            '<i class="fa-solid fa-circle-chevron-right"></i>'
        ],
        onInitialized: updateInfo,
        onTranslated: updateInfo
    });

});