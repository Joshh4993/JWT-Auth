import Projects from "../models/ProjectModel.js";

export const getProjects = async (req, res) => {
    try {
        const projects = await Projects.findAll({
            attributes: ['id', 'name', 'creator', 'description', 'project_ref', 'private']
        });
        res.json(projects);
    } catch (error) {
        console.log(error)
    }
}

export const getProject = async (req, res) => {
    try {
        const { id } = req.body
        const project = await Projects.findAll({
            where: {
                id: id
            }
        });
        let projectObj = {
            projectId: project[0].id,
            name: project[0].name,
            creator: project[0].creator,
            description: project[0].description,
            project_ref: project[0].project_ref,
            private: project[0].private
        }
        res.json(projectObj);
    } catch (error) {
        res.status(404).json({ msg: "Project not found." });
    }
}

export const createProject = async (req, res) => {
    const { name, creator, description, project_ref, private_ } = req.body;
    let p_private_;
    if (private_ == "true") {
        p_private_ = true
    } else {
        p_private_ = false
    }
    try {
        await Projects.create({
            name: name,
            creator: creator,
            description: description,
            project_ref: project_ref,
            private: p_private_
        });
        res.json({ msg: "Project created successfully" });
    } catch (error) {
        console.log(error);
    }
}