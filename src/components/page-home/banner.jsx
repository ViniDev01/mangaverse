import BannerImage from '../../assets/img/banner-inicial.jpg'
function Banner() {
    return(
        <section className="banner">
            <div className="center">
                <a href="#"><img src={BannerImage} alt="" /></a>
            </div>
        </section>
    )
}

export default Banner;