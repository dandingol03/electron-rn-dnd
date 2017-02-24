
import React, { Component, PropTypes, } from 'react'


class Scroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    scrollCb(e)
    {
        //向下wheelDeltaY==-120,向上wheelDeltaX==120
        //向下应该向左移动
        //向上应该向右移动.彼此有阀值

        if(e.wheelDeltaY==-120)
        {
            // 向下,整体向←移动
            var tabContainer=this.tabContainer;
            var leftOffset=parseInt($(tabContainer).css('left').replace('px',''));
            leftOffset=leftOffset-10;
            if(window.Math.abs(leftOffset)>=(this.state.data.length*120))
                return true;
            $(tabContainer).css('left',leftOffset+'px');
        }else{
            //向上,整体向→移动
            var tabContainer=this.tabContainer;
            var leftOffset=parseInt($(tabContainer).css('left').replace('px',''));
            leftOffset=leftOffset+10;
            if(leftOffset>=0)
                return true;
            $(tabContainer).css('left',leftOffset+'px');
        }
    }

    render(){

        let view=null;
        if(this.state.data!==undefined&&this.state.data!==null)
        {
            let tabs=[];
            this.state.data.map(function (tab,i) {
                tabs.push(
                    <li key={i} onScroll={()=>{

                    }}
                        style={{width:120,height:50,padding:12,float:'left',listStyle:'none',textAlign:'center',
                            background:'rgba(0, 136, 204, 0.26)',color:'#fff',borderRight:'1px solid '}}>
                        {tab}
                    </li>);
            })
            view=
                <ul className="origin" ref={(item)=>{
                    this.tabContainer=item;
                }} style={{paddingLeft:0,overflow:'hidden',width:'1200px',position:'absolute',top:0}}>
                    {tabs}
                </ul>
        }else{
            view=<div>Scroll</div>;
        }

        return (
            <div style={{width:'100%',position:'relative'}}>
                {view}
            </div>
        )
    }

    componentDidMount()
    {
        document.addEventListener('wheel', this.scrollCb.bind(this),false);
    }
}



module.exports=Scroll;
