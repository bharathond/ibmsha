import React from 'react'

function SidebarComponent() {
  return (
    <aside className="rightcolumn">
        <div className="card">
            <h2>About Me</h2>
            <div className="fakeimg" style={{height:"100px"}}>Image</div>
            <p>Some text about me in culpa qui officia deserunt mollit anim..</p>
        </div>
        <div className="card">
            <h3>Popular Post</h3>
            <div className="fakeimg">Image</div><br/>
            <div className="fakeimg">Image</div><br/>
            <div className="fakeimg">Image</div>
        </div>
        <div className="card">
            <h3>Follow Me</h3>
            <p>Some text..</p>
        </div>
    </aside>
  )
}

export default SidebarComponent;
