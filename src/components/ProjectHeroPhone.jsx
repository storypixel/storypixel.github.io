import React from 'react';
import Phone3D from './Phone3D';

const ProjectHeroPhone = ({ screenshots }) => {
    // If no screenshots, don't render anything (Phone3D also handles this, but good to be explicit for the wrapper)
    if (!screenshots || screenshots.length === 0) return null;

    // This container class handles the "poking out" positioning and responsive logic
    // defined in index.css
    return (
        <div className="project-phone-container">
            <Phone3D screenshots={screenshots} />
        </div>
    );
};

export default ProjectHeroPhone;
